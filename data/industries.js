const INDUSTRIES = [
  {
    industry: 'Accounting',
  },
  {
    industry: 'Airlines_Aviationa',
  },
  {
    industry: 'Alternative_Dispute_Resolutiona',
  },
  {
    industry: 'Alternative_Medicinea',
  },
  {
    industry: 'Animation',
  },
  {
    industry: 'Apparel_and_Fashion',
  },
  {
    industry: 'Architecture_and_Planning',
  },
  {
    industry: 'Arts_and_Crafts',
  },
  {
    industry: 'Automotive',
  },
  {
    industry: 'Aviation_and_Aerospace',
  },
  {
    industry: 'Banking',
  },
  {
    industry: 'Biotechnology',
  },
  {
    industry: 'Broadcast_Media',
  },
  {
    industry: 'Building_Materials',
  },
  {
    industry: 'Business_Supplies_and_Equipment',
  },
  {
    industry: 'Capital_Markets',
  },
  {
    industry: 'Chemicals',
  },
  {
    industry: 'Civic_and_Social_Organization',
  },
  {
    industry: 'Civil_Engineering',
  },
  {
    industry: 'Commercial_Real_Estate',
  },
  {
    industry: 'Computer_and_Network_Security',
  },
  {
    industry: 'Computer_Games',
  },
  {
    industry: 'Computer_Hardware',
  },
  {
    industry: 'Computer_Networking',
  },
  {
    industry: 'Computer_Software',
  },
  {
    industry: 'Construction',
  },
  {
    industry: 'Consumer_Electronics',
  },
  {
    industry: 'Consumer_Goods',
  },
  {
    industry: 'Consumer_Services',
  },
  {
    industry: 'Cosmetics',
  },
  {
    industry: 'Dairy',
  },
  {
    industry: 'Defense_and_Space',
  },
  {
    industry: 'Design',
  },
  {
    industry: 'ELearning',
  },
  {
    industry: 'Education_Management',
  },
  {
    industry: 'Electrical_Electronic_Manufacturing',
  },
  {
    industry: 'Entertainment',
  },
  {
    industry: 'Environmental_Services',
  },
  {
    industry: 'Events_Services',
  },
  {
    industry: 'Executive_Office',
  },
  {
    industry: 'Facilities_Services',
  },
  {
    industry: 'Farming',
  },
  {
    industry: 'Financial_Services',
  },
  {
    industry: 'Fine_Art',
  },
  {
    industry: 'Fishery',
  },
  {
    industry: 'Food_and_Beverages',
  },
  {
    industry: 'Food_Production',
  },
  {
    industry: 'Fund_Raising',
  },
  {
    industry: 'Furniture',
  },
  {
    industry: 'Gambling_and_Casinos',
  },
  {
    industry: 'Glass__Ceramics_and_Concrete',
  },
  {
    industry: 'Government_Administration',
  },
  {
    industry: 'Government_Relations',
  },
  {
    industry: 'Graphic_Design',
  },
  {
    industry: 'Health__Wellness_and_Fitness',
  },
  {
    industry: 'Higher_Education',
  },
  {
    industry: 'Hospital_and_Health_Care',
  },
  {
    industry: 'Hospitality',
  },
  {
    industry: 'Human_Resources',
  },
  {
    industry: 'Import_and_Export',
  },
  {
    industry: 'Individual_and_Family_Services',
  },
  {
    industry: 'Industrial_Automation',
  },
  {
    industry: 'Information_Services',
  },
  {
    industry: 'Information_Technology_and_Services',
  },
  {
    industry: 'Insurance',
  },
  {
    industry: 'International_Affairs',
  },
  {
    industry: 'International_Trade_and_Development',
  },
  {
    industry: 'Internet',
  },
  {
    industry: 'Investment_Banking',
  },
  {
    industry: 'Investment_Management',
  },
  {
    industry: 'Judiciary',
  },
  {
    industry: 'Law_Enforcement',
  },
  {
    industry: 'Law_Practice',
  },
  {
    industry: 'Legal_Services',
  },
  {
    industry: 'Legislative_Office',
  },
  {
    industry: 'Leisure__Travel_and_Tourism',
  },
  {
    industry: 'Libraries',
  },
  {
    industry: 'Logistics_and_Supply_Chain',
  },
  {
    industry: 'Luxury_Goods_and_Jewelry',
  },
  {
    industry: 'Machinery',
  },
  {
    industry: 'Management_Consulting',
  },
  {
    industry: 'Maritime',
  },
  {
    industry: 'Market_Research',
  },
  {
    industry: 'Marketing_and_Advertising',
  },
  {
    industry: 'Mechanical_or_Industrial_Engineering',
  },
  {
    industry: 'Media_Production',
  },
  {
    industry: 'Medical_Devices',
  },
  {
    industry: 'Medical_Practice',
  },
  {
    industry: 'Mental_Health_Care',
  },
  {
    industry: 'Military',
  },
  {
    industry: 'Mining_and_Metals',
  },
  {
    industry: 'Motion_Pictures_and_Film',
  },
  {
    industry: 'Museums_and_Institutions',
  },
  {
    industry: 'Music',
  },
  {
    industry: 'Nanotechnology',
  },
  {
    industry: 'Newspapers',
  },
  {
    industry: 'Nonprofit_Organization_Management',
  },
  {
    industry: 'Oil_and_Energy',
  },
  {
    industry: 'Online_Media',
  },
  {
    industry: 'Outsourcing_Offshoring',
  },
  {
    industry: 'Package_Freight_Delivery',
  },
  {
    industry: 'Packaging_and_Containers',
  },
  {
    industry: 'Paper_and_Forest_Products',
  },
  {
    industry: 'Performing_Arts',
  },
  {
    industry: 'Pharmaceuticals',
  },
  {
    industry: 'Philanthropy',
  },
  {
    industry: 'Photography',
  },
  {
    industry: 'Plastics',
  },
  {
    industry: 'Political_Organization',
  },
  {
    industry: 'Primary_Secondary_Education',
  },
  {
    industry: 'Printing',
  },
  {
    industry: 'Professional_Training_and_Coaching',
  },
  {
    industry: 'Program_Development',
  },
  {
    industry: 'Public_Policy',
  },
  {
    industry: 'Public_Relations_and_Communications',
  },
  {
    industry: 'Public_Safety',
  },
  {
    industry: 'Publishing',
  },
  {
    industry: 'Railroad_Manufacture',
  },
  {
    industry: 'Ranching',
  },
  {
    industry: 'Real_Estate',
  },
  {
    industry: 'Recreational_Facilities_and_Services',
  },
  {
    industry: 'Religious_Institutions',
  },
  {
    industry: 'Renewables_and_Environment',
  },
  {
    industry: 'Research',
  },
  {
    industry: 'Restaurants',
  },
  {
    industry: 'Retail',
  },
  {
    industry: 'Security_and_Investigations',
  },
  {
    industry: 'Semiconductors',
  },
  {
    industry: 'Shipbuilding',
  },
  {
    industry: 'Sporting_Goods',
  },
  {
    industry: 'Sports',
  },
  {
    industry: 'Staffing_and_Recruiting',
  },
  {
    industry: 'Supermarkets',
  },
  {
    industry: 'Telecommunications',
  },
  {
    industry: 'Textiles',
  },
  {
    industry: 'Think_Tanks',
  },
  {
    industry: 'Tobacco',
  },
  {
    industry: 'Translation_and_Localization',
  },
  {
    industry: 'Transportation_Trucking_Railroad',
  },
  {
    industry: 'Utilities',
  },
  {
    industry: 'Venture',
  },
  {
    industry: 'Capital_and_Private_Equity',
  },
  {
    industry: 'Veterinary',
  },
  {
    industry: 'Warehousing',
  },
  {
    industry: 'Wholesale',
  },
  {
    industry: 'Wine_and_Spirits',
  },
  {
    industry: 'Wireless',
  },
  {
    industry: 'Writing_and_Editing',
  },
];

export default INDUSTRIES;
