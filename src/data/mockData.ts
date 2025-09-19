import { EnvironmentalData, CommunityActivity } from '../types/user';

// Mock Environmental Data
export const mockEnvironmentalData: EnvironmentalData = {
  criticalIssues: [
    {
      id: 'issue_1',
      type: 'heatwave',
      severity: 'high',
      title: 'Extended Heat Wave Warning',
      description: 'Temperatures 8°C above seasonal average expected for the next 5 days. Heat index reaching dangerous levels.',
      aiInsights: 'Satellite thermal analysis shows urban heat island effect intensifying. Historical data indicates this is the 3rd most severe heat event in the past decade. Vulnerable populations at highest risk during afternoon hours.',
      actionSuggestions: [
        'Check on elderly neighbors and those without air conditioning',
        'Create community cooling centers in public buildings',
        'Distribute water and shade materials to outdoor workers',
        'Organize heat safety awareness campaigns'
      ],
      lastUpdated: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'issue_2',
      type: 'air-quality',
      severity: 'medium',
      title: 'Moderate Air Quality Alert',
      description: 'PM2.5 levels elevated due to regional wildfire smoke. Sensitive groups should limit outdoor activities.',
      aiInsights: 'Wind pattern analysis suggests smoke will persist for 2-3 days. Air quality monitoring shows 40% above normal particulate matter. Children and elderly most affected.',
      actionSuggestions: [
        'Encourage indoor activities for schools and daycares',
        'Promote use of air purifiers in community centers',
        'Share respiratory health resources with vulnerable populations'
      ],
      lastUpdated: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'issue_3',
      type: 'drought',
      severity: 'critical',
      title: 'Severe Drought Conditions',
      description: 'Precipitation 65% below normal for the season. Groundwater levels at historic lows.',
      aiInsights: 'Satellite vegetation analysis reveals widespread crop stress. Reservoir levels dropped 30% in past month. Current trajectory suggests water restrictions needed within 60 days.',
      actionSuggestions: [
        'Implement community water conservation programs',
        'Install rainwater harvesting systems',
        'Promote drought-resistant landscaping initiatives',
        'Organize water-saving education workshops'
      ],
      lastUpdated: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  
  satelliteData: {
    imageUrl: 'https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=800',
    analysisDate: new Date(Date.now() - 86400000).toISOString(),
    changeDetected: true,
    summary: 'Recent analysis reveals significant environmental changes in your region. Thermal imaging shows increased surface temperatures in urban areas, while vegetation indices indicate stress in agricultural zones. Water body analysis suggests reduced surface area in key reservoirs. These changes align with current drought and heat wave conditions.',
    aiAnnotations: [
      {
        id: 'ann_1',
        x: 25,
        y: 35,
        type: 'warning',
        description: 'Urban heat island detected - surface temperatures 5°C above surrounding areas'
      },
      {
        id: 'ann_2',
        x: 70,
        y: 20,
        type: 'change',
        description: 'Vegetation stress visible in agricultural areas - 25% reduction in green cover'
      },
      {
        id: 'ann_3',
        x: 45,
        y: 80,
        type: 'warning',
        description: 'Water body shrinkage - reservoir at 60% capacity compared to seasonal normal'
      },
      {
        id: 'ann_4',
        x: 15,
        y: 60,
        type: 'normal',
        description: 'Healthy forest cover maintained in protected areas'
      }
    ]
  },

  weatherData: {
    current: {
      temperature: 38,
      humidity: 35,
      windSpeed: 12,
      condition: 'sunny',
      icon: 'sun'
    },
    airQuality: {
      aqi: 85,
      pm25: 28,
      pm10: 45,
      status: 'moderate'
    },
    forecast: [
      {
        date: new Date(Date.now() + 86400000).toISOString(),
        high: 40,
        low: 28,
        condition: 'sunny',
        icon: 'sun',
        precipitationChance: 5
      },
      {
        date: new Date(Date.now() + 172800000).toISOString(),
        high: 39,
        low: 27,
        condition: 'sunny',
        icon: 'sun',
        precipitationChance: 10
      },
      {
        date: new Date(Date.now() + 259200000).toISOString(),
        high: 35,
        low: 25,
        condition: 'cloudy',
        icon: 'cloud',
        precipitationChance: 25
      },
      {
        date: new Date(Date.now() + 345600000).toISOString(),
        high: 32,
        low: 22,
        condition: 'rainy',
        icon: 'rain',
        precipitationChance: 70
      },
      {
        date: new Date(Date.now() + 432000000).toISOString(),
        high: 29,
        low: 20,
        condition: 'rainy',
        icon: 'rain',
        precipitationChance: 60
      }
    ],
    aiSummary: 'The current heat wave represents an extreme weather event with significant health and environmental risks. Temperature persistence above 35°C for 5+ days creates dangerous conditions. Relief expected by weekend with incoming weather system bringing much-needed precipitation. Air quality concerns from regional fires add complexity to health recommendations.',
    unusualPatterns: [
      'Night-time temperatures staying above 25°C - preventing natural cooling',
      'Humidity levels 20% below seasonal average - increasing fire risk',
      'Wind patterns shifted southward - bringing smoke from distant wildfires'
    ]
  },

  newsData: [
    {
      id: 'news_1',
      title: 'City Council Approves Emergency Heat Response Plan',
      summary: 'Local government unanimously passes comprehensive heat emergency protocols including extended cooling center hours, enhanced welfare checks for vulnerable residents, and free water distribution at transit stops.',
      source: 'Local Tribune',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      url: 'https://example.com/heat-response-plan',
      category: 'policy',
      relevanceScore: 95
    },
    {
      id: 'news_2',
      title: 'Community Gardens Show Resilience During Drought',
      summary: 'Local community gardens using innovative water conservation techniques report 40% water savings while maintaining crop yields. Techniques being shared across neighborhood groups.',
      source: 'Environmental Network',
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      url: 'https://example.com/community-gardens',
      category: 'community',
      relevanceScore: 88
    },
    {
      id: 'news_3',
      title: 'New Research Links Urban Heat Islands to Health Disparities',
      summary: 'University study finds that surface temperature variations across the city correlate with emergency room visits, with low-income neighborhoods experiencing temperatures 3-7°C higher than affluent areas.',
      source: 'Science Journal',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      url: 'https://example.com/heat-research',
      category: 'research',
      relevanceScore: 82
    },
    {
      id: 'news_4',
      title: 'Regional Climate Adaptation Summit Set for Next Month',
      summary: 'Multi-city collaboration to address shared climate challenges. Focus on water security, extreme heat preparation, and community resilience building. Public participation encouraged.',
      source: 'Regional News',
      publishedAt: new Date(Date.now() - 129600000).toISOString(),
      url: 'https://example.com/climate-summit',
      category: 'event',
      relevanceScore: 75
    },
    {
      id: 'news_5',
      title: 'Local Solar Initiative Reduces Grid Stress During Heat Wave',
      summary: 'Community solar program providing 15% of peak demand during extreme heat events. Residents with panels reporting 40% lower electricity bills despite increased cooling needs.',
      source: 'Green Energy Today',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      url: 'https://example.com/solar-success',
      category: 'community',
      relevanceScore: 70
    },
    {
      id: 'news_6',
      title: 'State Announces Drought Emergency Declaration',
      summary: 'Governor declares drought emergency for region, unlocking emergency water resources and funding for conservation programs. Mandatory water restrictions begin next week.',
      source: 'State News Service',
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      url: 'https://example.com/drought-emergency',
      category: 'policy',
      relevanceScore: 92
    }
  ]
};

// Mock Community Activities
export const mockCommunityActivities: CommunityActivity[] = [
  {
    id: 'activity_1',
    title: 'Emergency Community Cooling Center Setup',
    description: 'Help set up and volunteer at our emergency cooling center during this heat wave. We need volunteers to help with setup, welcome desk, distribute water, and assist vulnerable community members. This is a critical community response to the current extreme heat conditions.',
    organizer: {
      name: 'Maria Rodriguez',
      id: 'user_volunteer_1'
    },
    location: {
      name: 'Central Community Center, 123 Main Street',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    dateTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    duration: 8,
    category: 'community',
    maxParticipants: 25,
    currentParticipants: 18,
    tags: ['heat-relief', 'emergency-response', 'vulnerable-populations', 'urgent'],
    requirements: [
      'Must be able to work in potentially crowded conditions',
      'Bring refillable water bottle',
      'Comfortable shoes required',
      'Basic first aid training preferred but not required'
    ],
    status: 'upcoming'
  },
  {
    id: 'activity_2',
    title: 'Drought-Resistant Community Garden Workshop',
    description: 'Learn and implement water-wise gardening techniques in our community space. We\'ll install drip irrigation, plant native species, and create mulch beds. Perfect for beginners and experienced gardeners alike. Help build resilience against ongoing drought conditions.',
    organizer: {
      name: 'James Chen',
      id: 'user_gardener_1'
    },
    location: {
      name: 'Riverside Community Garden, Oak Avenue',
      coordinates: {
        lat: 40.7589,
        lng: -73.9851
      }
    },
    dateTime: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    duration: 4,
    category: 'planting',
    maxParticipants: 15,
    currentParticipants: 9,
    tags: ['drought-resistant', 'water-conservation', 'native-plants', 'hands-on'],
    requirements: [
      'Bring work gloves',
      'Wear clothes you don\'t mind getting dirty',
      'Sun hat and sunscreen recommended',
      'Bring a shovel if you have one'
    ],
    status: 'upcoming'
  },
  {
    id: 'activity_3',
    title: 'Air Quality Monitoring Citizen Science Project',
    description: 'Join our citizen science initiative to monitor air quality across different neighborhoods. We\'ll train volunteers to use portable air quality monitors and collect data that helps inform community health decisions. Data contributes to university research on environmental justice.',
    organizer: {
      name: 'Dr. Sarah Williams',
      id: 'user_scientist_1'
    },
    location: {
      name: 'Environmental Studies Building, University Campus',
      coordinates: {
        lat: 40.7505,
        lng: -73.9934
      }
    },
    dateTime: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    duration: 3,
    category: 'research',
    maxParticipants: 20,
    currentParticipants: 12,
    tags: ['citizen-science', 'air-quality', 'data-collection', 'research'],
    requirements: [
      'Smartphone with GPS required',
      'Ability to walk for extended periods',
      'Interest in data collection and analysis',
      'Notebook and pen'
    ],
    status: 'upcoming'
  },
  {
    id: 'activity_4',
    title: 'Heat Island Mapping and Tree Planting Initiative',
    description: 'Combine science with action! We\'ll use thermal cameras to map heat islands in our neighborhood, then plant shade trees in the hottest areas. This project directly addresses urban heat while creating lasting community assets. Perfect blend of data and direct action.',
    organizer: {
      name: 'Green Neighborhoods Coalition',
      id: 'user_org_1'
    },
    location: {
      name: 'Meet at City Hall Plaza, then various locations',
      coordinates: {
        lat: 40.7282,
        lng: -74.0776
      }
    },
    dateTime: new Date(Date.now() + 604800000).toISOString(), // 1 week from now
    duration: 6,
    category: 'planting',
    maxParticipants: 30,
    currentParticipants: 23,
    tags: ['tree-planting', 'heat-island', 'thermal-mapping', 'long-term-impact'],
    requirements: [
      'Wear long sleeves and pants for tree planting',
      'Bring work gloves and water bottle',
      'Comfortable walking shoes essential',
      'Camera phone helpful for documentation'
    ],
    status: 'upcoming'
  },
  {
    id: 'activity_5',
    title: 'Climate Resilience Neighborhood Planning Session',
    description: 'Community-led planning session to develop our neighborhood\'s climate adaptation strategy. We\'ll discuss flood preparedness, heat response, water conservation, and emergency communication systems. Your input shapes our collective response to climate challenges.',
    organizer: {
      name: 'Resilient Communities Network',
      id: 'user_org_2'
    },
    location: {
      name: 'Public Library Conference Room, 456 Green Street',
      coordinates: {
        lat: 40.7614,
        lng: -73.9776
      }
    },
    dateTime: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks from now
    duration: 3,
    category: 'advocacy',
    currentParticipants: 8,
    tags: ['planning', 'resilience', 'community-input', 'adaptation'],
    requirements: [
      'No special requirements - all welcome',
      'Bring ideas and concerns about climate risks',
      'Note-taking materials helpful'
    ],
    status: 'upcoming'
  },
  {
    id: 'activity_6',
    title: 'Youth Climate Action Art Workshop',
    description: 'Creative expression meets climate action! Young people create art installations highlighting local environmental challenges and solutions. Artworks will be displayed publicly to raise awareness. All skill levels welcome - we provide materials and mentorship.',
    organizer: {
      name: 'Youth Climate Collective',
      id: 'user_youth_1'
    },
    location: {
      name: 'Community Arts Center, 789 Creative Lane',
      coordinates: {
        lat: 40.7463,
        lng: -74.0014
      }
    },
    dateTime: new Date(Date.now() + 1814400000).toISOString(), // 3 weeks from now
    duration: 5,
    category: 'awareness',
    maxParticipants: 25,
    currentParticipants: 16,
    tags: ['youth', 'art', 'awareness', 'creative', 'public-display'],
    requirements: [
      'Ages 12-25 preferred but adults welcome as mentors',
      'No art experience necessary',
      'Bring any art supplies you\'d like to contribute',
      'Wear clothes you don\'t mind getting messy'
    ],
    status: 'upcoming'
  }
];