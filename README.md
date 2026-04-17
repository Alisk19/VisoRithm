# VisoRithm 🚀

Welcome to **VisoRithm**! This is a state-of-the-art Web Application designed to make learning Data Structures and Algorithms (DSA) an immersive, highly visual, and interactive experience. 

Built with modern web technologies, VisoRithm provides an elegant UI, smooth animations, and detailed step-by-step visualizations to simplify complex computer science concepts.

## 🌟 Key Features

*   **Interactive Visualizations:** Step-by-step graphical execution of complex algorithms (e.g., Graph traversals, Dynamic Programming, Sorting).
*   **Premium Dark UI:** Designed with aesthetics in mind, utilizing modern glassmorphism, fluid typography, and rich visual hierarchies to keep users engaged.
*   **Extensive Algorithm Library:** Covers a wide range of algorithms including:
    *   Pathfinding (A*, Dijkstra)
    *   N-Queens Problem
    *   0/1 Knapsack & DP Problems
    *   Graph Algorithms (BFS/DFS)
*   **Real-time Complexity Analysis:** Dynamic tracking of time and space complexities during code execution.
*   **Algorithm Playground:** Change inputs/graphs interactively and observe algorithms in real-time.
*   **Fully Responsive:** Seamlessly functional across desktop and mobile viewing with smooth scroll behaviors and responsive layouts.

## 🛠️ Tech Stack

*   **Framework:** React 19 / Vite
*   **Styling:** Tailwind CSS / Custom CSS with advanced design tokens
*   **Animations:** Framer Motion, GSAP
*   **Deployment:** Vercel (Optimized for instant deployment without configuration logic overhead)

## 🚀 Getting Started

If you want to run this project locally, simply follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Alisk19/VisoRithm.git
    cd VisoRithm
    ```

2.  **Install Dependencies:**
    Make sure you have Node installed, then run:
    ```bash
    npm install
    ```

3.  **Run Locally:**
    Start the Vite development server:
    ```bash
    npm run dev
    ```

4.  **Build for Production (Vercel Ready):**
    ```bash
    npm run build
    ```

## 🏗️ Architecture & Design Decisions

*   **Component-Driven Development:** UI elements are isolated as reusable React components (e.g., `AnimatedCard`, `TheoryPanel`, `ExplanationPanel`).
*   **State Management:** Extensively uses lightweight local states (`useState`, `useRef`) along with well-structured prop drilling for parent-child communication in visualization steps.
*   **Extensible Algorithms:** The `src/algorithms/` structure isolates complex logic, maintaining a "Steps Array" pattern that allows the UI player to move forward/backward seamlessly without recalibrating logic.
*   **Vercel-native optimization:** Designed so that Vercel accurately assumes the `/dist` directory for its production deployments natively through Vite.

## 💡 About the Developer

This project demonstrates strong capabilities in **Frontend Engineering**, showcasing advanced skills in:
- React state/lifecycle management
- Advanced CSS, Framer Motion animations & UX design principles
- Building educational, high-complexity platforms
- Responsive layouts and scalable frontend scaffolding

Enjoy exploring the algorithms!
