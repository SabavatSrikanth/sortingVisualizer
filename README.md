# 📊 Sorting Algorithm Visualizer

A sleek, interactive web application that visualizes how different sorting algorithms work under the hood. Watch the arrays sort themselves in real-time, track the number of comparisons and swaps, and even input your own custom data sets!

Created by **Srikanth**.

## ✨ Features

* **Real-Time Visualization:** Watch the sorting process step-by-step with smooth animations. 
* **Custom Inputs:** Generate a random array or input your own comma-separated list of numbers.
* **Live Statistics:** Tracks the exact number of array comparisons and swaps as the algorithm runs.
* **Color-Coded Actions:** * 🟥 **Red:** Elements currently being compared.
  * 🟦 **Blue:** Elements currently being swapped or written.
* **Control Flow:** Easily start or stop the sorting process at any time.

## 🧮 Supported Algorithms

1. **Bubble Sort**
2. **Selection Sort**
3. **Insertion Sort**
4. **Merge Sort**

## 🛠️ Tech Stack

* **HTML5:** Page structure and UI controls.
* **CSS3:** Dark-themed UI, Google Fonts ("Quantico"), and smooth CSS transitions for the bar heights and colors.
* **Vanilla JavaScript (ES6+):** Algorithm logic, DOM manipulation, and asynchronous sleep functions to handle the animation delays.

## 🚀 How to Run

This project is purely frontend, meaning there are no servers, databases, or dependencies to install.

1. Clone or download this repository to your local machine.
2. Ensure `index.html`, `style.css`, and `script.js` are in the same folder.
3. Simply double-click `index.html` to open it in your default web browser.

## 📁 Project Structure

```text
├── index.html   # The main UI and layout
├── style.css    # Styling, colors, and layout animations
├── script.js    # Sorting logic, stats tracking, and DOM updates
└── README.md    # Project documentation