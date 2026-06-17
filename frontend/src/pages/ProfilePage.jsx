import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure, logout } from '../features/auth/authSlice';
import api from '../services/api';
import { Helmet } from 'react-helmet-async';
import PageWrapper from '../components/layout/PageWrapper';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Camera, Trash2, Loader2, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
  });

  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      toast.error('Avatar image must be less than 5MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const newAvatarUrl = res.data.data.url;
        setAvatar(newAvatarUrl);
        
        // Immediately update profile with new avatar
        dispatch(updateProfileStart());
        const updateRes = await api.put('/auth/profile', { avatar: newAvatarUrl });
        dispatch(updateProfileSuccess({ user: updateRes.data, token: updateRes.data.token }));
        toast.success('Avatar updated successfully!');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast.error('Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle Profile Update Form Submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    dispatch(updateProfileStart());

    try {
      const payload = {
        username: formData.username !== user.username ? formData.username : undefined,
      };

      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
        payload.currentPassword = formData.currentPassword;
      }

      const res = await api.put('/auth/profile', payload);
      dispatch(updateProfileSuccess({ user: res.data, token: res.data.token }));
      
      // Clear password fields
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      dispatch(updateProfileFailure(error.response?.data?.message || 'Update failed'));
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you absolutely sure you want to delete your account? This cannot be undone.');
    if (!confirmDelete) return;

    setDeletingAccount(true);
    try {
      await api.delete('/auth/account');
      dispatch(logout());
      toast.success('Your account has been deleted.');
      navigate('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
      toast.error('Failed to delete account.');
      setDeletingAccount(false);
    }
  };

  // Determine if user has a standard password account (not purely Google OAuth without password)
  const isGoogleOnly = user?.googleId && !user?.hasPassword; 
  // Wait, our backend doesn't send `hasPassword`. 
  // Actually, if a user tries to set a password without a current one and backend expects it, backend handles it.
  // We'll let the backend validate if currentPassword is required.

  if (!user) return null;

  return (
    <PageWrapper>
      <Helmet>
        <title>Profile | War Economic Impact</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Summary */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center"
            >
              <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted flex items-center justify-center relative shadow-lg">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-muted-foreground" />
                  )}
                  {/* Overlay for hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingAvatar ? (
                      <Loader2 className="animate-spin text-white" size={24} />
                    ) : (
                      <Camera className="text-white" size={24} />
                    )}
                  </div>
                </div>
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
              </div>

              <h2 className="text-xl font-bold text-foreground truncate w-full">{user.username}</h2>
              <p className="text-sm text-muted-foreground truncate w-full">{user.email}</p>
              
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {user.isAdmin ? 'Administrator' : 'Standard User'}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Settings Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* General Info Form */}
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleUpdateProfile}
              className="bg-card border border-border rounded-xl p-6 space-y-6"
            >
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User size={18} className="text-primary" />
                Profile Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                    Email <span className="text-xs font-normal text-muted-foreground/50">(Cannot be changed)</span>
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-3 rounded-lg bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-70"
                  />
                </div>

                <hr className="border-border my-6" />

                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lock size={18} className="text-primary" />
                  Security Settings
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  Leave password fields blank if you do not wish to change your password. 
                  (If you signed up with Google, you may not need a current password).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full p-3 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {updatingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </motion.form>

            {/* Danger Zone */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-destructive/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-destructive flex items-center gap-2 mb-2">
                <Trash2 size={18} />
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
                className="px-4 py-2 border border-destructive text-destructive font-medium rounded-lg hover:bg-destructive hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deletingAccount ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                Delete Account
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ProfilePage;
