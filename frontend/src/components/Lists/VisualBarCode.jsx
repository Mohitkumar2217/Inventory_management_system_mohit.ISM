import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const VisualBarCode = ({ value }) => {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current && value && value !== "No Barcode") {
            try {
                JsBarcode(barcodeRef.current, value, {
                    format: "CODE128",
                    lineColor: "#1e293b", // Slate-800
                    width: 1.5,
                    height: 30,
                    displayValue: false, // Keep it clean as the text is already in DetailItem
                    background: "transparent",
                    margin: 0
                });
            } catch (e) {
                console.error("Invalid barcode format");
            }
        }
    }, [value]);

    if (!value || value === "No Barcode") return null;

    return (
        <div className="mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <svg ref={barcodeRef}></svg>
        </div>
    );
};

export default VisualBarCode;