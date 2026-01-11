# LLMeta Usage Guide

> Your complete guide to navigating and using the LLMeta application.

## Quick Start

### System Requirements

| Requirement | Details |
|-------------|---------|
| **Browser** | Modern web browser (Chrome, Firefox, Safari, Edge) |
| **Connection** | Stable internet connection |
| **Audio** | Microphone for voice chat |
| **Input** | Keyboard and mouse |

### Accessing the Application

Navigate to the application URL in your browser. You'll be greeted by the landing page with the tagline **"Beyond limits, with AI"**.

---

## Getting Started

### 1. Authentication

LLMeta uses secure server-side authentication powered by Supabase. Your session is managed via HTTP-only cookies, ensuring security and instant page loads.

#### Creating an Account

1. Navigate to the **Sign Up** page (`/signup`)
2. Enter your **Display Name** — This is how other users will see you
3. Enter your **Email** and **Password**
4. Confirm your password
5. Click **"Create Account"**
6. Check your email for a confirmation link and click it to verify your account

#### Logging In

1. Navigate to the **Login** page (`/login`)
2. Enter your registered **Email** and **Password**
3. Click **"Sign In"**
4. You'll be redirected to the Home page

> [!NOTE]
> Authentication is validated server-side. If your session expires, you'll be automatically redirected to the login page.

#### Logging Out

Click the **Sign Out** button in the sidebar or profile page to sign out of your account.

### 2. Home

After logging in, you'll see the **Home** page — your central hub for exploring worlds.

**Features:**

- **Sidebar Navigation** — Access Home and Settings pages
- **World List** — Browse available metaverse worlds displayed as cards
- **User Info** — Your display name is shown in the sidebar footer

**To Enter a World:**
Click on a world card to view its details.

### 3. World Detail Page

The world detail page (`/world/[worldId]`) shows comprehensive information about a specific world.

**What You'll See:**

- **Hero Section** — Large thumbnail image with world name and description
- **World Info** — Player capacity and creation date
- **Instance List** — Active rooms you can join

**Creating an Instance:**

1. Click **"Create Instance"** button
2. Enter a room name (optional — a default name will be generated if left empty)
3. Click **"Create"**
4. You'll be redirected to the instance lobby

**Joining an Existing Instance:**
Click **"Join"** on any instance card to enter that room.

### 4. Instance Lobby

The instance lobby (`/instance/[roomSid]`) is where you configure your identity before entering the virtual world.

**Steps to Join:**

1. **Wait for Connection** — A connection indicator shows your server status:
   - 🔄 *Connecting...* — Please wait
   - ✅ *Connected* — Ready to proceed
   - ❌ *Failed* — Click "Retry" to reconnect

2. **Edit Display Name** — Your display name is loaded from your profile. You can update it here (maximum 20 characters)

3. **Choose Avatar** — Click on one of the available VRM avatars to select your virtual representation

4. **Click "Continue"** — Once connected and configured, enter the 3D world

> [!NOTE]
> Your display name and avatar selection are automatically saved to your profile.

> [!WARNING]
> **Privacy Notice**: This application sends data to external services. Do not share personal or sensitive information.

### 5. Settings Page

Access your settings via the sidebar or navigating to `/settings`.

**Available Settings:**

| Setting | Description |
|---------|-------------|
| **Avatar** | Your current avatar initial display |
| **Email** | Your registered email (read-only) |
| **Display Name** | Editable — click "Update" to save changes |
| **Language** | Switch between English and Japanese |
| **Sign Out** | Log out from your account |

### 6. The 3D Experience

After joining an instance, you'll be immersed in the 3D metaverse with other users and your personal AI agent.

---

## User Interface

The HUD (Heads-Up Display) provides all essential information and controls while you explore the virtual world.

### Status Bar (Top)

Located at the top of the screen, the status bar displays three key indicators:

| Element | Description |
|---------|-------------|
| **Connection Status** | Current server connection state (connecting/connected/failed) |
| **Transcription Status** | Active/inactive indicator for speech-to-text |
| **Player Count** | Number of users currently online in the room |

### Caption Window (Below Status Bar)

Displays **real-time speech transcriptions** from other users in the world. This helps you follow conversations even without audio.

### Chat Stream (Bottom Left)

Shows **text messages** from all users in the current room. Messages appear in a scrollable stream format with sender information and timestamps.

### Dock (Bottom Center)

The main control bar with four primary buttons:

| Button | Function |
|--------|----------|
| 👁️ **View Toggle** | Switch between first-person and third-person camera views |
| 🎙️ **Voice Chat** | Mute/unmute your microphone |
| ⚙️ **Settings** | Open the settings drawer with General, Language, and Controls tabs |
| 🚪 **Leave** | Leave the current room and return to Home |

Additionally, the **AI Chat** button is positioned on the right side of the screen for quick access to your AI agent.

---

## Features

### Voice Communication

LLMeta features real-time voice chat powered by LiveKit and Deepgram.

**How to Use:**

- Click the **microphone button** in the dock to toggle mute/unmute
- When unmuted, your voice is transmitted to all users in the room
- Your speech is **automatically transcribed** and displayed to others

> [!TIP]
> Grant microphone permissions when prompted by your browser for voice chat to work.

### Text Chat

Send text messages visible to all users in the room.

- Messages appear in the **Chat Stream** on the bottom-left
- Type your message and press **Enter** to send
- All participants can see the chat history

### AI Agent

Your personal AI assistant is always available to help with communication.

**Opening the AI Agent:**
Click the AI Agent button in the dock to open the chat sidebar.

**Capabilities:**

| Feature | Description |
|---------|-------------|
| 📝 **Conversation Summaries** | Condense long discussions into key points |
| 🔍 **Flow Explanation** | Understand how the conversation progressed |
| ⚠️ **Misunderstanding Detection** | Identify potential confusion points |
| 🎨 **Image Generation** | Create visuals based on chat context |

**Quick Suggestions:**
- "Summarize this chat"
- "Explain the conversation flow"
- "Are there any misunderstandings?"
- "Generate an image based on the chat"

> [!NOTE]
> You can refine generated images by adding additional instructions.

### View Toggle

Switch between camera perspectives for different experiences:

| View | Description |
|------|-------------|
| **First-Person** | See through your avatar's eyes for immersive experience |
| **Third-Person** | See your avatar from behind for spatial awareness |

### Settings

Access settings by clicking the gear icon in the dock or pressing **P**.

**Tabs:**

| Tab | Options |
|-----|--------|
| **General** | View username and avatar, session information (Room Name, Room SID, Session ID) |
| **Language** | Switch between English (🇺🇸) and Japanese (🇯🇵) |
| **Controls** | View and customize keyboard shortcuts for movement and camera controls |

---

## Controls

### Movement

Navigate through the 3D world using keyboard controls:

| Key | Action |
|-----|--------|
| `W` / `↑` | Move forward |
| `S` / `↓` | Move backward |
| `A` / `←` | Strafe left |
| `D` / `→` | Strafe right |

### Camera

| Input | Action |
|-------|--------|
| **Mouse Movement** | Look around / rotate camera |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `P` | Open/close Preferences |

---

## Troubleshooting

### Connection Issues

| Symptom | Solution |
|---------|----------|
| "Connection failed" message | Click **Retry** button or refresh the page |
| Perpetual "Connecting..." | Check your internet connection |
| Players not appearing | Wait a moment for sync, or refresh |

### Voice Chat Issues

| Symptom | Solution |
|---------|----------|
| Microphone not working | Ensure browser has microphone permission |
| "Permission denied" error | Go to browser settings and allow microphone access |
| Others can't hear you | Check that you're not muted (microphone button) |

### Performance Issues

| Symptom | Solution |
|---------|----------|
| Low frame rate | Close other browser tabs and applications |
| Laggy movement | Check network stability |
| Avatar not loading | Wait for assets to fully load, or refresh |

---

## Getting Help

If you encounter issues not covered in this guide:

1. Refresh the page to reset the application state
2. Try a different browser to rule out compatibility issues
3. Check your network connection stability

---

*LLMeta — Beyond limits, with AI*
