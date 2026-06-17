import { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 50 }, data: { label: 'Data Source: Global Conflicts' }, type: 'input' },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'Filter: High GDP Loss (>20%)' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'Filter: Ongoing Status' } },
  { id: '4', position: { x: 250, y: 250 }, data: { label: 'Aggregate: Average Inflation' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

const WorkflowPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Data Workflow Builder</h1>
        <p className="text-muted-foreground">Visually construct analytical pipelines to filter and aggregate conflict data.</p>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden min-h-[600px] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-background"
        >
          <Controls className="bg-card border-border fill-foreground" />
          <MiniMap className="bg-card border-border" nodeColor="var(--primary)" />
          <Background variant="dots" gap={12} size={1} color="var(--border)" />
        </ReactFlow>
        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm p-4 rounded-md border border-border">
          <h3 className="font-semibold text-sm mb-2">Instructions</h3>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
            <li>Drag nodes to rearrange.</li>
            <li>Connect nodes by dragging from handles.</li>
            <li>Select nodes and press Backspace to delete.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
