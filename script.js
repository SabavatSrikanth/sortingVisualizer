// Elements
const container = document.getElementById("bars");
const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");

// Data & state
let arr = [];
let stopFlag = false;
let comparisons = 0;
let swaps = 0;
const DELAY = 90; // animation speed (keep it fast but visible)

// -------- Helpers --------
function updateStats(){
  comparisonsEl.textContent = comparisons;
  swapsEl.textContent = swaps;
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function resetStats(){
  comparisons = 0;
  swaps = 0;
  updateStats();
}

function clearBars(){
  container.innerHTML = "";
}

function addBar(value){
  const div = document.createElement("div");
  div.className = "bar";
  div.style.height = `${value}px`;
  container.appendChild(div);
}

function getBars(){ return container.querySelectorAll(".bar"); }

// -------- UI actions --------
function generateArray(size = 20){
  stopSort();
  arr = [];
  clearBars();
  resetStats();

  for(let i=0;i<size;i++){
    const v = Math.floor(Math.random()*300)+20; // 20..320 px
    arr.push(v);
    addBar(v);
  }
}

function setCustomArray(){
  stopSort();
  const raw = document.getElementById("customInput").value.trim();
  if(!raw){ return; }

  const vals = raw.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  if(vals.length === 0){ alert("Please enter valid numbers separated by commas."); return; }

  arr = vals.map(v => Math.max(10, Math.min(350, v))); // clamp to look nice
  clearBars();
  resetStats();
  arr.forEach(addBar);
}

function stopSort(){ stopFlag = true; }

// -------- Sorting entry --------
async function startSort(){
  stopFlag = false;
  resetStats();
  const algo = document.getElementById("algorithm").value;

  if(algo === "bubble")      await bubbleSort();
  else if(algo === "selection") await selectionSort();
  else if(algo === "insertion") await insertionSort();
  else if(algo === "merge")     await mergeSortDriver();
}

// -------- Anim helpers for color & swap --------
async function markCompare(bars, i, j){
  comparisons++;
  updateStats();
  bars[i].classList.add("comparing");
  if(j !== undefined) bars[j].classList.add("comparing");
  await sleep(DELAY);
  bars[i].classList.remove("comparing");
  if(j !== undefined) bars[j].classList.remove("comparing");
}

async function doSwapHeights(bars, i, j){
  swaps++;
  updateStats();
  bars[i].classList.add("swapping");
  bars[j].classList.add("swapping");

  // swap data
  [arr[i], arr[j]] = [arr[j], arr[i]];
  // swap visuals
  const h = bars[i].style.height;
  bars[i].style.height = bars[j].style.height;
  bars[j].style.height = h;

  await sleep(DELAY);
  bars[i].classList.remove("swapping");
  bars[j].classList.remove("swapping");
}

// -------- Bubble Sort --------
async function bubbleSort(){
  const bars = getBars();
  for(let i=0;i<arr.length-1 && !stopFlag;i++){
    for(let j=0;j<arr.length-1-i && !stopFlag;j++){
      await markCompare(bars, j, j+1);
      if(arr[j] > arr[j+1]){
        await doSwapHeights(bars, j, j+1);
      }
    }
  }
}

// -------- Selection Sort --------
async function selectionSort(){
  const bars = getBars();
  for(let i=0;i<arr.length && !stopFlag;i++){
    let min = i;
    for(let j=i+1;j<arr.length && !stopFlag;j++){
      await markCompare(bars, min, j);
      if(arr[j] < arr[min]) min = j;
    }
    if(min !== i){
      await doSwapHeights(bars, i, min);
    }
  }
}

// -------- Insertion Sort --------
async function insertionSort(){
  const bars = getBars();
  for(let i=1;i<arr.length && !stopFlag;i++){
    const key = arr[i];
    let keyHeight = bars[i].style.height;
    let j = i-1;

    while(j >= 0 && arr[j] > key && !stopFlag){
      await markCompare(bars, j, j+1);

      // shift right (treat as a swap for color)
      swaps++; updateStats();
      bars[j].classList.add("swapping");
      bars[j+1].classList.add("swapping");

      arr[j+1] = arr[j];
      bars[j+1].style.height = bars[j].style.height;

      await sleep(DELAY);
      bars[j].classList.remove("swapping");
      bars[j+1].classList.remove("swapping");
      j--;
    }
    arr[j+1] = key;
    bars[j+1].style.height = keyHeight;
  }
}

// -------- Merge Sort (stable, visual writes) --------
async function mergeSortDriver(){
  const bars = getBars();
  await mergeSort(0, arr.length-1, bars);
}

async function mergeSort(l, r, bars){
  if(l >= r || stopFlag) return;
  const m = Math.floor((l + r) / 2);
  await mergeSort(l, m, bars);
  await mergeSort(m+1, r, bars);
  await merge(l, m, r, bars);
}

async function merge(l, m, r, bars){
  const left = arr.slice(l, m+1);
  const right = arr.slice(m+1, r+1);
  let i = 0, j = 0, k = l;

  while(i < left.length && j < right.length && !stopFlag){
    // comparison (virtually left[i] vs right[j])
    comparisons++; updateStats();
    // briefly mark the target slot as comparison
    bars[k].classList.add("comparing");
    await sleep(DELAY);
    bars[k].classList.remove("comparing");

    if(left[i] <= right[j]){
      arr[k] = left[i];
      bars[k].style.height = `${left[i]}px`;
      i++;
    } else {
      arr[k] = right[j];
      bars[k].style.height = `${right[j]}px`;

      // treat placement from right half as a "swap-ish" write
      bars[k].classList.add("swapping");
      swaps++; updateStats();
      await sleep(DELAY);
      bars[k].classList.remove("swapping");

      j++;
    }
    k++;
  }

  // remainders
  while(i < left.length && !stopFlag){
    arr[k] = left[i];
    bars[k].style.height = `${left[i]}px`;
    i++; k++;
    await sleep(DELAY);
  }
  while(j < right.length && !stopFlag){
    arr[k] = right[j];
    bars[k].style.height = `${right[j]}px`;
    // mark write as swap-ish for consistency
    bars[k].classList.add("swapping");
    swaps++; updateStats();
    await sleep(DELAY);
    bars[k].classList.remove("swapping");

    j++; k++;
  }
}

// -------- Init --------
generateArray();