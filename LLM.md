# 🧘‍♀️ FlowFocus — Project Context for LLMs

## 🧩 Overview
FlowFocus is a **web-based focus and productivity app** that helps users maintain deep concentration through:
- A customizable **Pomodoro timer**
- A selection of **ambient soundscapes**
- A **Perlin noise flow field animation** that runs during sessions

The design goal is to create a *calm, aesthetic, and distraction-free environment* that merges productivity with visual and auditory mindfulness.

---

## 🧠 Project Summary
**Purpose:**  
Help users focus through structured work sessions, immersive visuals, and ambient sound.

**Tagline:**  
“Flow through focus.”

**Core Pillars:**
1. **Focus Management:** Custom Pomodoro cycles (2–5 sets, user-defined durations)
2. **Sensory Flow:** Animated Perlin flow field as visual feedback
3. **Sound Immersion:** Looping ambient audio hosted in AWS S3
4. **Zero Clutter:** Minimal UI and fully serverless backend

---

## 🏗️ Architecture

### 🌐 Frontend
| Component | Tech | Description |
|------------|------|-------------|
| Framework | React + Tailwind | SPA for timer, sound, and visuals |
| Canvas Engine | p5.js / react-three-fiber | Renders Perlin noise flow field |
| Audio Engine | Howler.js | Manages playback, volume, and loops |
| Storage | localStorage | Saves last session and preferences |
| Deployment | AWS S3 + CloudFront | Static site hosting and CDN delivery |

---

### ⚙️ Backend
| Service | Technology | Role |
|----------|-------------|------|
| API | AWS Lambda (Python) via API Gateway | Handles session creation, stats, and sound listing |
| Database | DynamoDB | Stores user sessions and configuration data |
| Storage | S3 | Hosts ambient audio and sound manifests |
| Edge | CloudFront | Delivers frontend and static assets globally |
| IAM Roles | Scoped to Lambda | Grants read/write access to DynamoDB and S3 |

---

### 🔗 Data Flow
```

User → CloudFront → S3 (Frontend)
↓
API Gateway → Lambda (Python)
↓
DynamoDB / S3 (Data & Audio)

```

---

## 🧰 API Overview
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/session/start` | POST | Create new session entry |
| `/api/session/end` | POST | Mark session completed |
| `/api/sounds/list` | GET | Fetch available soundtracks from S3 |
| `/api/config` | GET | Return default Pomodoro durations and app constants |

---

## 🧾 DynamoDB Schema

### Table: `FlowFocusSessions`
| Field | Type | Description |
|--------|------|-------------|
| `user_id` | String (PK) | User identifier |
| `session_id` | String (SK) | Unique session ID |
| `sets` | Number | Number of Pomodoro sets |
| `duration` | Number | Duration per set |
| `sound` | String | Chosen ambient sound |
| `started_at` | String (ISO) | Start timestamp |
| `ended_at` | String (ISO) | End timestamp |

---

## 🎧 Sound Asset Structure
All ambient sounds are stored in **AWS S3**, organized as:
```

s3://flowfocus-assets/
ambient/
rain.mp3
forest.mp3
cafe.mp3
manifest/sounds.json

````

Example `sounds.json`:
```json
[
  { "name": "Rain", "url": "https://cdn.flowfocus.app/rain.mp3" },
  { "name": "Forest", "url": "https://cdn.flowfocus.app/forest.mp3" },
  { "name": "Cafe", "url": "https://cdn.flowfocus.app/cafe.mp3" }
]
````

---

## 🪶 Visual Engine (Perlin Flow Field)

* Implemented with **p5.js**
* Generates noise-based vector fields for organic motion
* Colors adapt based on focus/break states
* Runs on a `<canvas>` element beneath UI

Example snippet:

```js
function draw() {
  background(10, 10, 25);
  for (let p of particles) {
    let angle = noise(p.x * 0.01, p.y * 0.01, zoff) * TWO_PI * 4;
    let v = p5.Vector.fromAngle(angle);
    p.add(v);
    stroke(150, 200, 255, 50);
    point(p.x, p.y);
  }
  zoff += 0.003;
}
```

---

## 🪜 Roadmap

| Phase | Feature                          | Status        |
| ----- | -------------------------------- | ------------- |
| 1     | MVP (Timer + Audio + Flow Field) | ⏳ In progress |
| 2     | Save Preferences (localStorage)  | 🔜 Planned    |
| 3     | Session History (DynamoDB)       | 🔜 Planned    |
| 4     | Custom Visual Themes             | 🔜 Future     |
| 5     | Public Launch (CloudFront CDN)   | 🔜 Future     |

---

## 🧩 Integration Notes (for LLMs)

When collaborating on this project, please:

* Prioritize **minimal, performant code** and **clean UI**
* Assume **frontend = React + Tailwind**, **backend = Python Lambda**
* Use **AWS SDK (boto3)** for any backend S3/DynamoDB interactions
* All audio and config data are **read-only public assets** from S3
* Avoid introducing external authentication — app is *local-first*

**LLMs can help with:**

* React component structure & state management
* Timer logic optimizations
* p5.js animation tuning
* AWS deployment automation (SAM / CDK)
* UI/UX enhancements (accessibility, responsiveness)

---

## 🧭 Project Keywords

`focus`, `pomodoro`, `flow state`, `ambient`, `perlin noise`, `react`, `tailwind`, `aws`, `lambda`, `serverless`, `dynamodb`, `p5.js`, `cloudfront`, `s3`

---

**Author:** Nikki
**Project:** FlowFocus
**Created:** October 2025
**Version:** v0.1 (MVP phase)
