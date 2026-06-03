import React, { useMemo, useState } from "react";

/* ── Static bar-chart view of an array, with state coloring per index.
   states[i] ∈ { "default" | "compare" | "swap" | "sorted" | "pivot" | "min" }
*/
const stateStyles = {
    default: { fill: "#e0e7ff", stroke: "#6366f1", text: "#3730a3" },
    compare: { fill: "#fde68a", stroke: "#d97706", text: "#92400e" },
    swap:    { fill: "#fecaca", stroke: "#dc2626", text: "#991b1b" },
    sorted:  { fill: "#bbf7d0", stroke: "#16a34a", text: "#166534" },
    pivot:   { fill: "#e9d5ff", stroke: "#7c3aed", text: "#5b21b6" },
    min:     { fill: "#bae6fd", stroke: "#0284c7", text: "#0c4a6e" },
};

function SortingChart({ array, states = {}, maxValue, barWidth = 38, height = 200 }) {
    const max = maxValue || Math.max(...array, 1);
    const gap = 6;
    const width = array.length * (barWidth + gap) + gap;

    return (
        <svg width={width} height={height + 36} style={{ display: "block", maxWidth: "100%" }}>
            {array.map((v, i) => {
                const s = stateStyles[states[i] || "default"];
                const h = Math.max(8, (v / max) * height);
                const x = gap + i * (barWidth + gap);
                const y = height - h;
                return (
                    <g key={i}>
                        <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={h}
                            rx={4}
                            fill={s.fill}
                            stroke={s.stroke}
                            strokeWidth="2"
                            style={{ transition: "all 200ms ease" }}
                        />
                        <text
                            x={x + barWidth / 2}
                            y={y - 4}
                            textAnchor="middle"
                            fontSize="11"
                            fontFamily="monospace"
                            fontWeight="700"
                            fill={s.text}
                        >
                            {v}
                        </text>
                        <text
                            x={x + barWidth / 2}
                            y={height + 14}
                            textAnchor="middle"
                            fontSize="10"
                            fontFamily="monospace"
                            fill="#9ca3af"
                        >
                            {i}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ── Step-through algorithm runner. Pass an `algorithm` function that takes
   the input array and returns a list of frames: { array, states, description }.
*/
function SortingStepper({ title, initialArray, algorithm }) {
    const frames = useMemo(() => algorithm([...initialArray]), [initialArray.join(","), algorithm]);
    const [step, setStep] = useState(0);
    const safeStep = Math.min(step, frames.length - 1);
    const current = frames[safeStep] || { array: initialArray, states: {}, description: "(idle)" };

    const next = () => { if (safeStep < frames.length - 1) setStep(safeStep + 1); };
    const prev = () => { if (safeStep > 0) setStep(safeStep - 1); };
    const reset = () => setStep(0);
    const skipToEnd = () => setStep(frames.length - 1);

    const max = Math.max(...initialArray, 1);

    const btn = (color = "#4f46e5") => ({
        padding: "6px 14px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 13,
        color: "white",
        background: color,
    });

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
            margin: "16px 0",
            background: "#fafafa",
            overflowX: "auto",
        }}>
            {title && (
                <div style={{ fontWeight: 600, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                    {title}
                </div>
            )}
            <div style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280", marginBottom: 10 }}>
                Step {safeStep + 1} / {frames.length} — <strong style={{ color: "#4338ca" }}>{current.description}</strong>
            </div>
            <SortingChart array={current.array} states={current.states} maxValue={max} />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                <button style={btn("#6b7280")} onClick={reset}>Reset</button>
                <button style={{ ...btn(), opacity: safeStep === 0 ? 0.5 : 1 }} onClick={prev} disabled={safeStep === 0}>← Prev</button>
                <button style={{ ...btn(), opacity: safeStep >= frames.length - 1 ? 0.5 : 1 }} onClick={next} disabled={safeStep >= frames.length - 1}>Next →</button>
                <button style={btn("#059669")} onClick={skipToEnd}>Skip to End</button>
            </div>
            <div style={{
                marginTop: 12,
                fontSize: 11,
                fontFamily: "monospace",
                color: "#6b7280",
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
            }}>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#fde68a", border: "1px solid #d97706", marginRight: 4, verticalAlign: "middle" }} />comparing</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#fecaca", border: "1px solid #dc2626", marginRight: 4, verticalAlign: "middle" }} />swapping</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#bbf7d0", border: "1px solid #16a34a", marginRight: 4, verticalAlign: "middle" }} />sorted</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#e9d5ff", border: "1px solid #7c3aed", marginRight: 4, verticalAlign: "middle" }} />pivot</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#bae6fd", border: "1px solid #0284c7", marginRight: 4, verticalAlign: "middle" }} />current min</span>
            </div>
        </div>
    );
}

/* ── Algorithm frame generators ────────────────────────────────────── */

function bubbleSortFrames(arr) {
    const frames = [];
    const n = arr.length;
    const sorted = new Set();
    frames.push({ array: [...arr], states: {}, description: "Start." });
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            const states = {};
            for (const s of sorted) states[s] = "sorted";
            states[j] = "compare"; states[j + 1] = "compare";
            frames.push({ array: [...arr], states, description: `Compare a[${j}] = ${arr[j]} with a[${j + 1}] = ${arr[j + 1]}.` });
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                const sw = {};
                for (const s of sorted) sw[s] = "sorted";
                sw[j] = "swap"; sw[j + 1] = "swap";
                frames.push({ array: [...arr], states: sw, description: `Out of order — swap.` });
            }
        }
        sorted.add(n - i - 1);
        const ds = {};
        for (const s of sorted) ds[s] = "sorted";
        frames.push({ array: [...arr], states: ds, description: `Largest unsorted element bubbled to index ${n - i - 1}.` });
    }
    sorted.add(0);
    const fin = {};
    for (const s of sorted) fin[s] = "sorted";
    frames.push({ array: [...arr], states: fin, description: "Done." });
    return frames;
}

function selectionSortFrames(arr) {
    const frames = [];
    const n = arr.length;
    const sorted = new Set();
    frames.push({ array: [...arr], states: {}, description: "Start." });
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        const ds = {};
        for (const s of sorted) ds[s] = "sorted";
        ds[minIdx] = "min";
        frames.push({ array: [...arr], states: ds, description: `i = ${i}. Assume a[${i}] = ${arr[i]} is the min of the unsorted region.` });
        for (let j = i + 1; j < n; j++) {
            const states = {};
            for (const s of sorted) states[s] = "sorted";
            states[minIdx] = "min"; states[j] = "compare";
            frames.push({ array: [...arr], states, description: `Compare a[${j}] = ${arr[j]} with current min a[${minIdx}] = ${arr[minIdx]}.` });
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                const ns = {};
                for (const s of sorted) ns[s] = "sorted";
                ns[minIdx] = "min";
                frames.push({ array: [...arr], states: ns, description: `New min: a[${minIdx}] = ${arr[minIdx]}.` });
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            const sw = {};
            for (const s of sorted) sw[s] = "sorted";
            sw[i] = "swap"; sw[minIdx] = "swap";
            frames.push({ array: [...arr], states: sw, description: `Swap a[${i}] and a[${minIdx}].` });
        }
        sorted.add(i);
    }
    sorted.add(n - 1);
    const fin = {};
    for (const s of sorted) fin[s] = "sorted";
    frames.push({ array: [...arr], states: fin, description: "Done." });
    return frames;
}

function insertionSortFrames(arr) {
    const frames = [];
    const n = arr.length;
    const sorted = new Set([0]);
    {
        const ds = {};
        for (const s of sorted) ds[s] = "sorted";
        frames.push({ array: [...arr], states: ds, description: "Index 0 is trivially sorted." });
    }
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        const ds = {};
        for (const s of sorted) ds[s] = "sorted";
        ds[i] = "compare";
        frames.push({ array: [...arr], states: ds, description: `Pick key = a[${i}] = ${key}. Find its place in the sorted prefix.` });
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            const states = {};
            for (const s of sorted) states[s] = "sorted";
            states[j] = "swap"; states[j + 1] = "swap";
            frames.push({ array: [...arr], states, description: `${arr[j]} > ${key}; shift a[${j}] right.` });
            j--;
        }
        arr[j + 1] = key;
        sorted.add(i);
        const fs = {};
        for (const s of sorted) fs[s] = "sorted";
        frames.push({ array: [...arr], states: fs, description: `Place key at index ${j + 1}. Sorted prefix is now 0..${i}.` });
    }
    return frames;
}

function mergeSortFrames(arr) {
    const frames = [];
    const sorted = new Set();
    frames.push({ array: [...arr], states: {}, description: "Start merge sort." });

    function merge(lo, mid, hi) {
        const left = arr.slice(lo, mid + 1);
        const right = arr.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;
        while (i < left.length && j < right.length) {
            const states = {};
            for (let idx = lo; idx <= hi; idx++) states[idx] = "compare";
            frames.push({ array: [...arr], states, description: `Merging window [${lo}..${hi}]: compare ${left[i]} and ${right[j]}.` });
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else                     arr[k++] = right[j++];
            const sw = {};
            for (let idx = lo; idx <= hi; idx++) sw[idx] = "swap";
            frames.push({ array: [...arr], states: sw, description: `Placed value at index ${k - 1}.` });
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
        const done = {};
        for (let idx = lo; idx <= hi; idx++) done[idx] = "sorted";
        frames.push({ array: [...arr], states: done, description: `Window [${lo}..${hi}] sorted.` });
    }

    function mergeSort(lo, hi) {
        if (lo >= hi) return;
        const mid = Math.floor((lo + hi) / 2);
        mergeSort(lo, mid);
        mergeSort(mid + 1, hi);
        merge(lo, mid, hi);
    }

    mergeSort(0, arr.length - 1);
    const fin = {};
    for (let i = 0; i < arr.length; i++) fin[i] = "sorted";
    frames.push({ array: [...arr], states: fin, description: "Done." });
    return frames;
}

function quickSortFrames(arr) {
    const frames = [];
    const sorted = new Set();
    frames.push({ array: [...arr], states: {}, description: "Start quicksort (Lomuto partition)." });

    function partition(lo, hi) {
        const pivot = arr[hi];
        const ps = {};
        for (const s of sorted) ps[s] = "sorted";
        ps[hi] = "pivot";
        frames.push({ array: [...arr], states: ps, description: `Partition [${lo}..${hi}]. Pivot = a[${hi}] = ${pivot}.` });
        let i = lo - 1;
        for (let j = lo; j < hi; j++) {
            const cs = {};
            for (const s of sorted) cs[s] = "sorted";
            cs[hi] = "pivot"; cs[j] = "compare";
            frames.push({ array: [...arr], states: cs, description: `Compare a[${j}] = ${arr[j]} with pivot ${pivot}.` });
            if (arr[j] <= pivot) {
                i++;
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    const sw = {};
                    for (const s of sorted) sw[s] = "sorted";
                    sw[hi] = "pivot"; sw[i] = "swap"; sw[j] = "swap";
                    frames.push({ array: [...arr], states: sw, description: `a[${j}] <= pivot — swap a[${i}] and a[${j}].` });
                }
            }
        }
        [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
        const ds = {};
        for (const s of sorted) ds[s] = "sorted";
        ds[i + 1] = "pivot";
        frames.push({ array: [...arr], states: ds, description: `Move pivot to final position ${i + 1}.` });
        sorted.add(i + 1);
        return i + 1;
    }

    function qsort(lo, hi) {
        if (lo >= hi) {
            if (lo === hi) sorted.add(lo);
            return;
        }
        const p = partition(lo, hi);
        qsort(lo, p - 1);
        qsort(p + 1, hi);
    }

    qsort(0, arr.length - 1);
    const fin = {};
    for (let i = 0; i < arr.length; i++) fin[i] = "sorted";
    frames.push({ array: [...arr], states: fin, description: "Done." });
    return frames;
}

export { SortingChart, SortingStepper, bubbleSortFrames, selectionSortFrames, insertionSortFrames, mergeSortFrames, quickSortFrames };
