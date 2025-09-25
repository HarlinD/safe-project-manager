# Wireframes och Mockups - SAFe Projektledningsapp

## 1. Huvudnavigering och Layout

### 1.1 Huvudlayout (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🏢 SAFe Project Manager                    🔔 📧 👤 David (Portföljansvarig)   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────┐ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Navigation  │ │                        Main Content                        │ │
│ │             │ │                                                             │ │
│ │ 📊 Dashboard│ │                                                             │ │
│ │ 🚂 Release   │ │                                                             │ │
│ │   Train     │ │                                                             │ │
│ │ 📋 PI       │ │                                                             │ │
│ │   Planning  │ │                                                             │ │
│ │ 📝 Backlog  │ │                                                             │ │
│ │ 🏃 Sprint   │ │                                                             │ │
│ │   Planning  │ │                                                             │ │
│ │ ⚠️  Risks    │ │                                                             │ │
│ │ 📈 Metrics  │ │                                                             │ │
│ │ 👥 Stake-   │ │                                                             │ │
│ │   holders   │ │                                                             │ │
│ │ ⚙️  Settings │ │                                                             │ │
│ │             │ │                                                             │ │
│ └─────────────┘ └─────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Mobil Layout
```
┌─────────────────────────┐
│ 🏢 SAFe PM    🔔 👤 David │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │    Main Content     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 📊 🚂 📋 🏃 ⚠️ 📈 👥 │ │
│ │ Bottom Navigation   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 2. Dashboard Wireframes

### 2.1 Portföljansvarig Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📊 Portfolio Dashboard                                    🔄 Last updated: 14:32 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Active Release  │ │ Total Projects  │ │ Critical Risks  │ │ Team Health     │ │
│ │ Trains          │ │                 │ │                 │ │ Score           │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │        5        │ │       23        │ │        3        │ │      8.2/10     │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │ ↗️ +2 this month │ │ ↗️ +3 this month │ │ ⚠️ Needs attention │ │ ↗️ +0.3 this week │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Release Train Overview                                                      │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │ │
│ │ │ RT-1        │ │ RT-2        │ │ RT-3        │ │ RT-4        │             │ │
│ │ │ E-commerce  │ │ Mobile App  │ │ Data        │ │ Analytics   │             │ │
│ │ │             │ │             │ │ Platform    │ │ Platform    │             │ │
│ │ │ 🟢 On Track │ │ 🟡 At Risk  │ │ 🟢 On Track │ │ 🔴 Delayed  │             │ │
│ │ │ 85% Complete│ │ 72% Complete│ │ 91% Complete│ │ 45% Complete│             │ │
│ │ │             │ │             │ │             │ │             │             │ │
│ │ │ Velocity: 42│ │ Velocity: 38│ │ Velocity: 45│ │ Velocity: 28│             │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Recent Activity & Alerts                                                    │ │
│ │ • 14:15 - RT-4: Critical risk identified - Resource shortage               │ │
│ │ • 13:45 - RT-2: Sprint 3 completed with 2 story points remaining          │ │
│ │ • 13:20 - RT-1: PI Planning session scheduled for next Monday              │ │
│ │ • 12:30 - RT-3: Feature "User Authentication" completed                   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Release Train Engineer Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🚂 Release Train Dashboard - E-commerce Platform                    🔄 14:32   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Current Sprint  │ │ Team Velocity   │ │ Features        │ │ Impediments      │ │
│ │ Progress        │ │                 │ │ Completed       │ │                 │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │      78%        │ │      42 SP      │ │      12/15      │ │        2        │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │ 🟢 On Track     │ │ ↗️ +3 from last │ │ 🟡 3 behind      │ │ ⚠️ 1 Critical    │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Team Status Overview                                                        │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │ │
│ │ │ Frontend    │ │ Backend     │ │ DevOps      │ │ QA          │             │ │
│ │ │ Team        │ │ Team        │ │ Team        │ │ Team        │             │ │
│ │ │             │ │             │ │             │ │             │             │ │
│ │ │ 👥 5 members │ │ 👥 4 members│ │ 👥 3 members│ │ 👥 3 members│             │ │
│ │ │ 🟢 Healthy   │ │ 🟢 Healthy   │ │ 🟡 Busy     │ │ 🟢 Healthy   │             │ │
│ │ │ Velocity: 15 │ │ Velocity: 18 │ │ Velocity: 9 │ │ Velocity: 12 │             │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ PI Objectives Progress                                                       │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🎯 Improve User Experience (85% complete)                              │ │ │
│ │ │ ████████████████████████████████████████████████████████████████████░░░░ │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🎯 Increase Performance (62% complete)                                 │ │ │
│ │ │ ████████████████████████████████████████████████████████████████░░░░░░░░ │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🎯 Enhance Security (45% complete)                                      │ │ │
│ │ │ ████████████████████████████████████████████████████████████████░░░░░░░░ │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3. PI Planning Management Wireframes

### 3.1 PI Planning Session Setup
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📋 PI Planning - E-commerce Platform RT-1                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Session Details                                                             │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                 │ │
│ │ │ Start Date      │ │ End Date        │ │ Duration        │                 │ │
│ │ │ 2024-01-15      │ │ 2024-01-17      │ │ 3 days          │                 │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘                 │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Participants                                                            │ │ │
│ │ │ • Frontend Team (5 members) - ✅ Confirmed                              │ │ │
│ │ │ • Backend Team (4 members) - ✅ Confirmed                               │ │ │
│ │ │ • DevOps Team (3 members) - ⏳ Pending                                  │ │ │
│ │ │ • QA Team (3 members) - ✅ Confirmed                                    │ │ │
│ │ │ • Product Owner - ✅ Confirmed                                          │ │ │
│ │ │ • Stakeholders (3) - ⏳ Pending                                         │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Team Capacity Planning                                                       │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Frontend Team Capacity                                                  │ │ │
│ │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │ │ │
│ │ │ │ Anna    │ │ Bob     │ │ Carol   │ │ David   │ │ Emma    │             │ │ │
│ │ │ │ 100%    │ │ 80%     │ │ 100%    │ │ 60%     │ │ 100%    │             │ │ │
│ │ │ │         │ │         │ │         │ │         │ │         │             │ │ │
│ │ │ │ Available│ │ Vacation│ │ Available│ │ Training│ │ Available│             │ │ │
│ │ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │ │ │
│ │ │ Total Capacity: 88% (44 story points)                                   │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ PI Objectives                                                               │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🎯 Improve User Experience                                             │ │ │
│ │ │ • Feature: Enhanced Search                                              │ │ │
│ │ │ • Feature: Mobile Optimization                                          │ │ │
│ │ │ • Feature: Performance Improvements                                     │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🎯 Increase Platform Performance                                        │ │ │
│ │ │ • Feature: Database Optimization                                        │ │ │
│ │ │ • Feature: Caching Implementation                                       │ │ │
│ │ │ • Feature: API Rate Limiting                                            │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 PI Planning Board
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📋 PI Planning Board - Drag & Drop Features to Teams                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Features Backlog                                                            │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │ │
│ │ │ Enhanced    │ │ Mobile      │ │ Database    │ │ Caching     │             │ │
│ │ │ Search      │ │ Optimization│ │ Optimization│ │ Implementation│             │ │
│ │ │             │ │             │ │             │ │             │             │ │
│ │ │ WSJF: 8.5   │ │ WSJF: 7.2   │ │ WSJF: 9.1   │ │ WSJF: 6.8   │             │ │
│ │ │ Size: 13 SP │ │ Size: 21 SP │ │ Size: 8 SP   │ │ Size: 5 SP  │             │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Team Allocation                                                             │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ │ Frontend Team   │ │ Backend Team    │ │ DevOps Team     │ │ QA Team         │ │
│ │ │ Capacity: 44 SP │ │ Capacity: 36 SP │ │ Capacity: 27 SP │ │ Capacity: 36 SP  │ │
│ │ │                 │ │                 │ │                 │ │                 │ │
│ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │
│ │ │ │ Enhanced    │ │ │ │ Database    │ │ │ │ Caching     │ │ │ │ Test        │ │ │
│ │ │ │ Search      │ │ │ │ Optimization│ │ │ │ Implementation│ │ │ │ Automation │ │ │
│ │ │ │ 13 SP       │ │ │ │ 8 SP        │ │ │ │ 5 SP        │ │ │ │ 8 SP       │ │ │
│ │ │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │ │
│ │ │                 │ │                 │ │                 │ │                 │ │
│ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │ │                 │ │                 │ │
│ │ │ │ Mobile      │ │ │ │ API Rate    │ │ │                 │ │                 │ │
│ │ │ │ Optimization│ │ │ │ Limiting    │ │ │                 │ │                 │ │
│ │ │ │ 21 SP       │ │ │ │ 12 SP       │ │ │                 │ │                 │ │
│ │ │ └─────────────┘ │ │ └─────────────┘ │ │                 │ │                 │ │
│ │ │                 │ │                 │ │                 │ │                 │ │
│ │ │ Remaining: 10 SP│ │ Remaining: 16 SP│ │ Remaining: 22 SP│ │ Remaining: 28 SP│ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Backlog Management Wireframes

### 4.1 Hierarkisk Backlog View
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📝 Backlog Management - E-commerce Platform                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ View Options: [Hierarchical] [Flat] [WSJF] [Dependencies]                   │ │
│ │ Filter: [All] [Epics] [Features] [User Stories] [Bugs]                     │ │
│ │ Search: [Enhanced Search...] 🔍                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ 📁 Epic: Improve User Experience (WSJF: 8.5)                              │ │
│ │ ├─ 📋 Feature: Enhanced Search (WSJF: 7.2)                                 │ │
│ │ │  ├─ 📄 User Story: As a user, I want to search by category               │ │
│ │ │  ├─ 📄 User Story: As a user, I want to filter search results            │ │
│ │ │  └─ 📄 User Story: As a user, I want to save search preferences          │ │
│ │ │                                                                           │ │
│ │ │ ├─ 📋 Feature: Mobile Optimization (WSJF: 6.8)                          │ │
│ │ │  ├─ 📄 User Story: As a mobile user, I want responsive design           │ │
│ │ │  ├─ 📄 User Story: As a mobile user, I want touch-friendly interface    │ │
│ │ │  └─ 📄 User Story: As a mobile user, I want offline functionality       │ │
│ │ │                                                                           │ │
│ │ └─ 📋 Feature: Performance Improvements (WSJF: 9.1)                           │ │
│ │    ├─ 📄 User Story: As a user, I want faster page load times              │ │
│ │    ├─ 📄 User Story: As a user, I want smooth scrolling                    │ │
│ │    └─ 📄 User Story: As a user, I want optimized images                    │ │
│ │                                                                             │ │
│ │ 📁 Epic: Increase Platform Performance (WSJF: 7.8)                          │ │
│ │ ├─ 📋 Feature: Database Optimization (WSJF: 8.2)                           │ │
│ │ │  ├─ 📄 User Story: As a developer, I want optimized queries              │ │
│ │ │  ├─ 📄 User Story: As a developer, I want connection pooling            │ │
│ │ │  └─ 📄 User Story: As a developer, I want query caching                │ │
│ │ │                                                                           │ │
│ │ └─ 📋 Feature: Caching Implementation (WSJF: 6.5)                         │ │
│ │    ├─ 📄 User Story: As a user, I want cached API responses                │ │
│ │    ├─ 📄 User Story: As a user, I want cached static content               │ │
│ │    └─ 📄 User Story: As a user, I want CDN integration                    │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 WSJF Prioritization View
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📝 Backlog Management - WSJF Prioritization                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ WSJF Calculator: Weighted Shortest Job First                                │ │
│ │ Formula: WSJF = Business Value / (Job Size × Time Criticality)             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Prioritized Backlog Items                                                   │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Rank │ Item                    │ BV │ Size │ TC │ WSJF │ Team │ Status │ │ │
│ │ ├─────────────────────────────────────────────────────────────────────────┤ │ │
│ │ │ 1    │ Database Optimization   │ 8  │ 5    │ 2   │ 8.0  │ BE   │ Ready │ │ │
│ │ │ 2    │ Enhanced Search         │ 7  │ 8    │ 2   │ 7.0  │ FE   │ Ready │ │ │
│ │ │ 3    │ Mobile Optimization     │ 6  │ 12   │ 2   │ 6.0  │ FE   │ Ready │ │ │
│ │ │ 4    │ Caching Implementation  │ 5  │ 6    │ 2   │ 5.0  │ DevOps│ Ready │ │ │
│ │ │ 5    │ API Rate Limiting       │ 4  │ 4    │ 2   │ 4.0  │ BE   │ Ready │ │ │
│ │ │ 6    │ Performance Monitoring  │ 3  │ 3    │ 2   │ 3.0  │ DevOps│ Ready │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ Legend: BV=Business Value, Size=Story Points, TC=Time Criticality          │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 5. Risk & Impediment Management Wireframes

### 5.1 Risk Register
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ Risk & Impediment Management                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Risk Assessment Matrix                                                      │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Impact →                                                               │ │ │
│ │ │ Prob ↓ │ Low │ Medium │ High │ Critical │                               │ │ │
│ │ │ High   │ 🟡  │ 🟠    │ 🔴   │ 🔴       │                               │ │ │
│ │ │ Medium │ 🟢  │ 🟡    │ 🟠   │ 🔴       │                               │ │ │
│ │ │ Low    │ 🟢  │ 🟢    │ 🟡   │ 🟠       │                               │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Active Risks                                                                │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🔴 Critical Risk: Resource Shortage                                   │ │ │
│ │ │ • Probability: High • Impact: High • Risk Score: 9                   │ │ │
│ │ │ • Owner: David (Portfolio Manager) • Due: 2024-01-20                  │ │ │
│ │ │ • Mitigation: Hire 2 additional developers by end of month             │ │ │
│ │ │ • Status: In Progress • Progress: 60%                                │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🟠 High Risk: Technical Debt                                          │ │ │
│ │ │ • Probability: Medium • Impact: High • Risk Score: 6                  │ │ │
│ │ │ • Owner: Anna (RTE) • Due: 2024-02-15                                 │ │ │
│ │ │ • Mitigation: Allocate 20% of sprint capacity to refactoring          │ │ │
│ │ │ • Status: Planned • Progress: 0%                                      │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🟡 Medium Risk: Third-party API Changes                               │ │ │
│ │ │ • Probability: Low • Impact: Medium • Risk Score: 3                  │ │ │
│ │ │ • Owner: Marcus (PO) • Due: 2024-03-01                                │ │ │
│ │ │ • Mitigation: Monitor API documentation and prepare fallback plan     │ │ │
│ │ │ • Status: Monitoring • Progress: 25%                                  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Impediment Tracking
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🚧 Impediment Tracking                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Active Impediments                                                          │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ 🔴 Critical: Database Performance Issues                              │ │ │
│ │ │ • Reported: 2024-01-15 • Reporter: Bob (Backend Team)                 │ │ │
│ │ │ • Owner: Carol (DevOps) • Assigned: 2024-01-15                       │ │ │
│ │ │ • Description: Database queries taking 5+ seconds, affecting UX       │ │ │
│ │ │ • Impact: High - Users experiencing slow page loads                   │ │ │
│ │ │ • Resolution: Optimize queries and add database indexes               │ │ │
│ │ │ • Status: In Progress • ETA: 2024-01-18                              │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🟡 Medium: Missing API Documentation                                  │ │ │
│ │ │ • Reported: 2024-01-14 • Reporter: Emma (Frontend Team)              │ │ │
│ │ │ • Owner: Marcus (PO) • Assigned: 2024-01-16                          │ │ │
│ │ │ • Description: New API endpoints lack proper documentation            │ │ │
│ │ │ • Impact: Medium - Developers spending extra time on integration     │ │ │
│ │ │ • Resolution: Create comprehensive API documentation                  │ │ │
│ │ │ • Status: Planned • ETA: 2024-01-22                                   │ │ │
│ │ │                                                                         │ │ │
│ │ │ 🟢 Low: Test Environment Instability                                  │ │ │
│ │ │ • Reported: 2024-01-13 • Reporter: Lisa (QA Team)                   │ │ │
│ │ │ • Owner: Carol (DevOps) • Assigned: 2024-01-14                       │ │ │
│ │ │ • Description: Test environment occasionally becomes unavailable      │ │ │
│ │ │ • Impact: Low - Minor delays in testing process                      │ │ │
│ │ │ • Resolution: Implement better monitoring and auto-recovery         │ │ │
│ │ │ • Status: Resolved • Resolved: 2024-01-16                             │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 6. Metrics & Reporting Wireframes

### 6.1 Team Metrics Dashboard
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📈 Metrics & Reporting Dashboard                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Time Period: [Last 3 months] [Last 6 months] [Last year] [Custom...]       │ │
│ │ Teams: [All Teams] [Frontend] [Backend] [DevOps] [QA]                      │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ Velocity Trend  │ │ Cycle Time      │ │ Lead Time       │ │ Defect Rate     │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │    42 SP        │ │   4.2 days      │ │   8.5 days      │ │    12%         │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │ ↗️ +3 from last │ │ ↘️ -0.5 from    │ │ ↘️ -1.2 from    │ │ ↘️ -2% from     │ │
│ │ sprint          │ │ last sprint     │ │ last sprint     │ │ last sprint     │ │
│ │                 │ │                 │ │                 │ │                 │ │
│ │ [Velocity Chart]│ │ [Cycle Chart]   │ │ [Lead Chart]    │ │ [Defect Chart]  │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Team Health Check Results                                                   │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Frontend Team Health Score: 8.2/10                                     │ │ │
│ │ │ • Collaboration: 9/10 • Technical Skills: 8/10                       │ │ │
│ │ │ • Process Adherence: 8/10 • Innovation: 7/10                          │ │ │
│ │ │                                                                         │ │ │
│ │ │ Backend Team Health Score: 8.5/10                                     │ │ │
│ │ │ • Collaboration: 9/10 • Technical Skills: 9/10                       │ │ │
│ │ │ • Process Adherence: 8/10 • Innovation: 8/10                         │ │ │
│ │ │                                                                         │ │ │
│ │ │ DevOps Team Health Score: 7.8/10                                      │ │ │
│ │ │ • Collaboration: 8/10 • Technical Skills: 8/10                       │ │ │
│ │ │ • Process Adherence: 7/10 • Innovation: 8/10                         │ │ │
│ │ │                                                                         │ │ │
│ │ │ QA Team Health Score: 8.0/10                                          │ │ │
│ │ │ • Collaboration: 8/10 • Technical Skills: 8/10                       │ │ │
│ │ │ • Process Adherence: 8/10 • Innovation: 8/10                         │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Custom Report Builder
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📊 Custom Report Builder                                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Report Configuration                                                       │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │ │
│ │ │ Report Name     │ │ Report Type     │ │ Schedule        │               │ │
│ │ │ Sprint Summary  │ │ Executive       │ │ Weekly          │               │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘               │ │
│ │                                                                             │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │ │
│ │ │ Recipients      │ │ Format          │ │ Data Source     │               │ │
│ │ │ stakeholders@   │ │ PDF + Excel     │ │ All Teams       │               │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘               │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Drag & Drop Report Sections                                                │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Available Sections:                                                    │ │ │
│ │ │ • Executive Summary • Velocity Trends • Risk Summary                   │ │ │
│ │ │ • Team Health • Feature Progress • Impediment Status                   │ │ │
│ │ │ • Budget Status • Resource Utilization • Quality Metrics              │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                             │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Report Preview:                                                          │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │ Executive Summary                                                    │ │ │ │
│ │ │ │ • 3 teams completed Sprint 12 successfully                           │ │ │ │
│ │ │ │ • Overall velocity increased by 8%                                  │ │ │ │
│ │ │ │ • 2 critical risks identified and mitigated                         │ │ │ │
│ │ │ │                                                                     │ │ │ │
│ │ │ │ Velocity Trends                                                     │ │ │ │
│ │ │ │ [Chart showing velocity trends for last 6 sprints]                  │ │ │ │
│ │ │ │                                                                     │ │ │ │
│ │ │ │ Risk Summary                                                        │ │ │ │
│ │ │ │ • 1 critical risk (Resource shortage) - In Progress                │ │ │ │
│ │ │ │ • 2 medium risks (Technical debt, API changes) - Planned           │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 7. Mobile Wireframes

### 7.1 Mobile Dashboard
```
┌─────────────────────────┐
│ 🏢 SAFe PM    🔔 👤 David │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ Portfolio Overview  │ │
│ │                     │ │
│ │ Release Trains: 5   │ │
│ │ Projects: 23        │ │
│ │ Critical Risks: 3   │ │
│ │ Team Health: 8.2/10 │ │
│ │                     │ │
│ │ [View Details]      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Recent Activity     │ │
│ │                     │ │
│ │ • RT-4: Risk alert  │ │
│ │ • RT-2: Sprint done │ │
│ │ • RT-1: PI Planning │ │
│ │ • RT-3: Feature done│ │
│ │                     │ │
│ │ [View All]          │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Quick Actions       │ │
│ │                     │ │
│ │ [📋 PI Planning]     │ │
│ │ [⚠️ Add Risk]        │ │
│ │ [📊 View Metrics]   │ │
│ │ [👥 Team Status]     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 📊 🚂 📋 🏃 ⚠️ 📈 👥 │ │
│ │ Bottom Navigation   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### 7.2 Mobile Backlog View
```
┌─────────────────────────┐
│ ← Backlog Management    │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ [Search...] 🔍      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 📁 Epic: Improve UX │ │
│ │ ├─ 📋 Enhanced Search│ │
│ │ │  ├─ 📄 Search by   │ │
│ │ │  │   category     │ │
│ │ │  ├─ 📄 Filter     │ │
│ │ │  │   results      │ │
│ │ │  └─ 📄 Save       │ │
│ │ │      preferences  │ │
│ │ │                   │ │
│ │ ├─ 📋 Mobile Opt.   │ │
│ │ │  ├─ 📄 Responsive │ │
│ │ │  ├─ 📄 Touch UI   │ │
│ │ │  └─ 📄 Offline    │ │
│ │ │                   │ │
│ │ └─ 📋 Performance   │ │
│ │    ├─ 📄 Fast load  │ │
│ │    ├─ 📄 Smooth     │ │
│ │    └─ 📄 Optimized  │ │
│ │                     │ │
│ │ [Load More...]      │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 📊 🚂 📋 🏃 ⚠️ 📈 👥 │ │
│ │ Bottom Navigation   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 8. Teknisk Implementation

### 8.1 React Component Structure
```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── PortfolioDashboard.tsx
│   │   ├── ReleaseTrainDashboard.tsx
│   │   └── MetricsWidget.tsx
│   ├── pi-planning/
│   │   ├── PIPlanningBoard.tsx
│   │   ├── TeamCapacity.tsx
│   │   └── PIObjectives.tsx
│   ├── backlog/
│   │   ├── BacklogHierarchy.tsx
│   │   ├── WSJFCalculator.tsx
│   │   └── DependencyMap.tsx
│   ├── risks/
│   │   ├── RiskRegister.tsx
│   │   ├── ImpedimentTracker.tsx
│   │   └── RiskMatrix.tsx
│   └── reports/
│       ├── ReportBuilder.tsx
│       ├── MetricsChart.tsx
│       └── TeamHealth.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── PIPlanning.tsx
│   ├── Backlog.tsx
│   ├── Risks.tsx
│   └── Reports.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useData.ts
│   └── useWebSocket.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── websocket.ts
├── types/
│   ├── user.ts
│   ├── project.ts
│   └── safe.ts
└── utils/
    ├── constants.ts
    ├── helpers.ts
    └── validators.ts
```

### 8.2 Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "3001:3001"
    command: npm start
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/safe_pm

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=safe_pm
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 9. Interaktionsdesign

### 9.1 Drag & Drop Interaktioner
- **PI Planning Board**: Dra Features mellan Teams
- **Backlog Management**: Dra items för prioritering
- **Report Builder**: Dra sections för layout
- **Dashboard**: Dra widgets för anpassning

### 9.2 Real-time Updates
- **WebSocket**: Live updates för collaboration
- **Notifications**: Toast notifications för alerts
- **Status Indicators**: Real-time status för teams och features
- **Progress Bars**: Live progress updates

### 9.3 Responsive Design
- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px+)
- **Touch Gestures**: Swipe, pinch-to-zoom, long-press
- **Accessibility**: WCAG 2.1 AA compliance
- **Keyboard Navigation**: Full keyboard support

## 10. Färgschema och Design System

### 10.1 Färgpalett
```
Primary Colors:
- SAFe Blue: #0066CC
- Success Green: #28A745
- Warning Orange: #FFC107
- Danger Red: #DC3545
- Info Cyan: #17A2B8

Neutral Colors:
- Dark Gray: #343A40
- Medium Gray: #6C757D
- Light Gray: #ADB5BD
- Background: #F8F9FA
- White: #FFFFFF
```

### 10.2 Typography
```
Headings: Inter, sans-serif
Body: Inter, sans-serif
Code: 'Fira Code', monospace

Font Sizes:
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.75rem (28px)
- H4: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
```

### 10.3 Spacing System
```
Spacing Scale:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- xxl: 3rem (48px)
```

---

**Dokumentversion:** 1.0  
**Senast uppdaterad:** 2024-12-19  
**Författare:** UX/UI Team  
**Godkänd av:** Produktchef
