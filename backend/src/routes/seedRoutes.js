const express = require('express');
const router = express.Router();
const Conflict = require('../models/Conflict');

const mockConflicts = [
  {
    name: "Syrian Civil War",
    type: "Civil War",
    region: "Middle East",
    country: "Syria",
    status: "Ongoing",
    startYear: 2011,
    gdpLoss: 60,
    inflation: 200,
    poverty: 80,
    extremePoverty: 50,
    foodInsecurity: 60,
    unemployment: 55,
    youthUnemployment: 70,
    sector: "Infrastructure",
    blackMarket: "High",
    blackMarketGoods: "Fuel, Food, Medicine",
    profiteering: "Widespread",
    currencyDevaluation: 90,
    currencyGap: 40,
    reconstructionCost: 400000000000,
    costOfWar: 1200000000000,
    informalEconomyPre: 30,
    informalEconomyDuring: 70,
    households: 5000000
  },
  {
    name: "Yemeni Civil War",
    type: "Civil War",
    region: "Middle East",
    country: "Yemen",
    status: "Ongoing",
    startYear: 2014,
    gdpLoss: 50,
    inflation: 150,
    poverty: 85,
    extremePoverty: 60,
    foodInsecurity: 70,
    unemployment: 60,
    youthUnemployment: 75,
    sector: "Agriculture",
    blackMarket: "High",
    blackMarketGoods: "Water, Fuel, Arms",
    profiteering: "Widespread",
    currencyDevaluation: 85,
    currencyGap: 50,
    reconstructionCost: 100000000000,
    costOfWar: 250000000000,
    informalEconomyPre: 40,
    informalEconomyDuring: 80,
    households: 4000000
  },
  {
    name: "Russo-Ukrainian War",
    type: "Interstate War",
    region: "Europe",
    country: "Ukraine",
    status: "Ongoing",
    startYear: 2014,
    endYear: null,
    gdpLoss: 30,
    inflation: 25,
    poverty: 20,
    extremePoverty: 5,
    foodInsecurity: 15,
    unemployment: 35,
    youthUnemployment: 40,
    sector: "Energy",
    blackMarket: "Medium",
    blackMarketGoods: "Currency, Generators",
    profiteering: "Isolated",
    currencyDevaluation: 40,
    currencyGap: 15,
    reconstructionCost: 750000000000,
    costOfWar: 1500000000000,
    informalEconomyPre: 15,
    informalEconomyDuring: 35,
    households: 15000000
  },
  {
    name: "Tigray War",
    type: "Civil War",
    region: "Africa",
    country: "Ethiopia",
    status: "Resolved",
    startYear: 2020,
    endYear: 2022,
    gdpLoss: 20,
    inflation: 35,
    poverty: 60,
    extremePoverty: 40,
    foodInsecurity: 80,
    unemployment: 45,
    youthUnemployment: 50,
    sector: "Agriculture",
    blackMarket: "Medium",
    blackMarketGoods: "Food, Medicine",
    profiteering: "Widespread",
    currencyDevaluation: 50,
    currencyGap: 30,
    reconstructionCost: 20000000000,
    costOfWar: 28000000000,
    informalEconomyPre: 45,
    informalEconomyDuring: 75,
    households: 2000000
  },
  {
    name: "Afghan War",
    type: "Asymmetric War",
    region: "Asia",
    country: "Afghanistan",
    status: "Resolved",
    startYear: 2001,
    endYear: 2021,
    gdpLoss: 40,
    inflation: 15,
    poverty: 90,
    extremePoverty: 70,
    foodInsecurity: 95,
    unemployment: 70,
    youthUnemployment: 80,
    sector: "Infrastructure",
    blackMarket: "High",
    blackMarketGoods: "Opium, Arms, Currency",
    profiteering: "Widespread",
    currencyDevaluation: 70,
    currencyGap: 20,
    reconstructionCost: 80000000000,
    costOfWar: 2260000000000,
    informalEconomyPre: 50,
    informalEconomyDuring: 85,
    households: 5000000
  }
];

router.get('/', async (req, res) => {
  try {
    await Conflict.deleteMany({});
    await Conflict.insertMany(mockConflicts);
    res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

module.exports = router;
