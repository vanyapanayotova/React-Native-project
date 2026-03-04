# vanyas-react-native-marketplace-2026
React Native Course Project 

## Link to APK
https://kavdesign.net/sites/vanya-react-native-marketplace-app.apk

## Walkthrough Tutorial (optional)
1. Install the app (see installation guide).
2. Launch the app and register or login.
3. Browse the marketplace tab – pull down to refresh the list.
4. Tap an item to see details; owner name opens profile.
5. Use the "+ New" button to publish an item (choose photo, set price).
6. Edit or delete your own entries from the detail screen or directly in the list.
7. Visit the Profile tab to view your information, try logout.

## Installation Guide
**Prerequisites**
- Node.js & npm (v18+)
- Expo CLI (`npm install -g expo-cli`) 
- Android Studio / Xcode (for native builds) or Expo Go on device

**Running locally**
1. Clone repository: git clone <repo-url>
2. cd React-Native-project
3. Install dependencies: `npm install`
4. Start Metro: `npm run start` (or `npm run android:go` / `npm run ios:go`) 
5. The app will open in Expo Go or emulator.

**Building APK**
1. `npm run build:apk` (requires Android SDK).
2. Locate generated .apk under android/app/build/outputs/apk/release and upload to repository.

## Functional Guide
1. Project Overview
 - *Application Name*: **Marketplace**
 - *Application Category / Topic*: **E‑commerce / Listings**
 - *Main Purpose*: **Allow users to publish, browse, edit and delete items for sale**
---
2. User Access & Permissions
- Guest (Not Authenticated)
 - Access: Login and Register screens only.
 - Cannot see marketplace content or perform actions.
- Authenticated User
 - Access: Marketplace tab (list, detail, create/edit form) and Profile tab.
 - Can view all items, create new items, edit/delete own items, view profiles.
---
3. Authentication & Session Handling
- Authentication Flow
 1. On startup the app loads stored credentials from secure store.
 2. If a token/user exist the main tab navigator is shown, otherwise auth stack.
 3. On login/register the credentials are sent to backend; response token/user set in secure state.
 4. Logout clears secure state and returns to auth screens.
- Session Persistence
 * User data saved with expo-secure-store via custom hook (useSecureState).
 * When the app restarts, the hook loads stored user and auto‑logs in.
---
4. Navigation Structure
Root Navigation Logic
* Navigation is split by authentication status: unauthenticated users see AuthNavigator (stack) while logged-in users see a bottom tab navigator.
- Main Navigation
 - Two tabs: **Marketplace**, **Search** and **Profile**.
- Nested Navigation
 * **Marketplace** tab contains a stack with List, Detail and Form screens.
 * **Profile** tab contains its own stack (currently one screen, but can show any profile by ID).
---
5. List → Details Flow
- List / Overview Screen
 * Displays list of items fetched from external API with title, price, owner, timestamp.
 * Users pull-to-refresh; tapping an item navigates to detail.
- Details Screen
 * Triggered via `navigation.navigate('ItemDetail', { item })`. 
 * Receives entire item object (id, title, description, price, etc.) via route parameters.
---
6. Data Source & Backend
- Backend Type
 * Real backend hosted on Custom Apache hosting (https://kavdesign.net/sites/custom/public) with REST endpoints for auth (/login, /register) and items.
---
7. Data Operations (CRUD)
- Read (GET)
 * GET /items is called in ItemsListScreen to populate list.
- Create (POST)
 * POST /items sent from form screen when publishing new item.
- Update / Delete (Mutation)
 * PUT /items/:id performed by form screen when editing.
 * DELETE /items/:id from detail or list when removing an owned item.
 * The UI keeps local state updated after server responses.
---
8. Forms & Validation
- Forms Used
 * Login form
 * Register form
 * Item creation/edit form
- Validation Rules
 1. Email fields must match basic pattern and be required.
 2. Password fields require at least 6 characters.
 3. Item description requires minimum length of 10.
 4. Item price must be a valid positive number.
 5. Confirm password field checks equality with password (multiple rules).
---
9. List of validated fields:
- email (login/register): required + pattern
- password (login/register): required + min length
- confirmPassword (register): required + matches password
- description (item): required + min length 10
---
10. Native Device Features
- **Image Picker** (via expo-image-picker): users choose a photo when creating an item; preview shown.

11. Typical User Flow
1. Open app; if previously logged in auto‑navigates to main tabs.
2. Register or login using email/password.
3. Browse marketplace; pull to refresh or tap an item for details.
4. Press + New to add a listing (pick photo, choose expiration date, mark featured).
5. Edit or delete own items from detail screen.
6. Visit profile tab to check info or logout.

12. Error & Edge Case Handling
- Authentication errors show alerts.
- Network failures display error messages with retry links.
- Empty lists display No items yet state.
- Form validation prevents submission, highlights fields.
---


## Markdown CheatSheet
[Link to cheatsheet](https://github.com/adam-p/markdown-here/wiki/markdown-cheatsheet)
