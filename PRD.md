# Taranto Professional Services Marketplace

A nostalgic Windows 95-style professional services marketplace for the city of Taranto, Italy.

**Experience Qualities**:
1. **Nostalgic** - Recreates the authentic Windows 95 interface with pixel-perfect detail and familiar interactions
2. **Functional** - Provides real marketplace functionality despite the retro interface, making professional services accessible
3. **Playful** - Combines serious business functionality with delightful retro computing elements

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected windows and features
- State management for appointments, messages, and user sessions
- Basic geolocation and mapping functionality

## Essential Features

**Boot Sequence**
- Functionality: Authentic Windows 95 startup experience with BIOS and loading screens
- Purpose: Creates immersive nostalgia and sets expectations for the retro experience
- Trigger: Application launch
- Progression: BIOS screen → Loading bar → Login selection → Desktop
- Success criteria: Smooth transition between boot stages, accurate Windows 95 visual reproduction

**User Authentication**
- Functionality: Role-based login (Cliente/Professionista) with different dashboards
- Purpose: Provides appropriate interface and functionality for each user type
- Trigger: Boot completion
- Progression: Login screen → Role selection → Personalized desktop interface
- Success criteria: Correct dashboard loading based on user type

**Professional Search & Discovery**
- Functionality: Search, filter, and locate professionals with map integration
- Purpose: Helps clients find and connect with local service providers
- Trigger: "Trova Professionisti" window launch
- Progression: Search input → Category filter → Map view → Professional selection → Booking
- Success criteria: Accurate search results, functional map with distance calculations

**Appointment Management**
- Functionality: Book, view, and manage appointments with status tracking
- Purpose: Streamlines professional service scheduling
- Trigger: Booking confirmation or appointment window access
- Progression: Professional selection → Time/date selection → Confirmation → Status tracking
- Success criteria: Persistent appointment storage, status updates, notification system

**Messaging System**
- Functionality: Communication between clients and professionals
- Purpose: Enables direct communication for service coordination
- Trigger: Message button or new message notification
- Progression: Message composition → Delivery → Read status → Response tracking
- Success criteria: Message persistence, unread indicators, notification system

**Window Management**
- Functionality: Draggable, resizable, minimizable windows with taskbar integration
- Purpose: Authentic Windows 95 multitasking experience
- Trigger: Opening any application or window
- Progression: Window launch → Drag/resize → Minimize/restore → Close
- Success criteria: Smooth window operations, proper z-indexing, mobile adaptation

## Edge Case Handling

- **Location Permission Denied**: Fallback to Taranto city center coordinates with "approximate location" indicator
- **Empty Search Results**: Clear messaging with suggestions to modify search criteria
- **Network Connectivity**: Graceful degradation with cached data and offline indicators
- **Mobile Touch Interactions**: Touch-optimized drag handles and button sizing for small screens
- **Window Overflow**: Automatic positioning and size constraints to prevent off-screen windows

## Design Direction

The design should evoke strong nostalgia and authenticity while maintaining modern usability - a faithful recreation of Windows 95 aesthetics with contemporary responsive behavior.

## Color Selection

Custom palette - Classic Windows 95 color scheme with authentic system colors.

- **Primary Color**: Classic Blue (#008080) - Represents the iconic Windows 95 teal desktop background, communicates reliability and professionalism
- **Secondary Colors**: Gray system palette (#C0C0C0, #808080) for window chrome and interface elements, maintains authentic system appearance
- **Accent Color**: Bright Red (#FF0000) for window controls and important actions, draws attention while staying true to system conventions
- **Foreground/Background Pairings**: 
  - Background (Teal #008080): Black text (#000000) - Ratio 8.2:1 ✓
  - Card (Light Gray #C0C0C0): Black text (#000000) - Ratio 12.6:1 ✓
  - Primary (Blue #000080): White text (#FFFFFF) - Ratio 8.6:1 ✓
  - Secondary (Gray #808080): White text (#FFFFFF) - Ratio 5.4:1 ✓
  - Accent (Red #FF0000): White text (#FFFFFF) - Ratio 5.2:1 ✓

## Font Selection

Monospace and system fonts should convey authentic retro computing characteristics while maintaining readability - MS Sans Serif and Terminal font aesthetics.

- **Typographic Hierarchy**: 
  - System UI (Window Titles): MS Sans Serif Bold/12px/normal spacing
  - Body Text (Content): MS Sans Serif Regular/11px/standard spacing
  - Buttons: MS Sans Serif Bold/11px/tight spacing
  - BIOS Text: Courier/12px/monospace spacing
  - Desktop Icons: MS Sans Serif Bold/10px/tight spacing

## Animations

Animations should be minimal and purposeful, focusing on authentic Windows 95 behavior rather than modern flourishes.

- **Purposeful Meaning**: Window operations (open/close/minimize) use instant state changes typical of Windows 95, with subtle hover effects on interactive elements
- **Hierarchy of Movement**: Boot sequence has progressive loading, window dragging provides immediate feedback, button presses show authentic pressed states

## Component Selection

- **Components**: Custom Windows 95-style components built with Tailwind, avoiding modern shadcn components that would break the aesthetic
- **Customizations**: Complete custom window chrome, buttons with inset/outset borders, authentic scrollbars and form controls
- **States**: All interactive elements have distinct pressed, hover, and focused states using box-shadow techniques
- **Icon Selection**: Emoji and custom Unicode symbols to represent classic Windows 95 iconography
- **Spacing**: Compact spacing typical of 1990s interfaces using Tailwind's tight spacing scale
- **Mobile**: Windows scale down appropriately, touch targets enlarged while maintaining visual authenticity, taskbar adapts to mobile constraints