"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import "katex/dist/katex.min.css"; // Import KaTeX CSS
import { InlineMath } from "react-katex"; // Import InlineMath

interface Shortcut {
  trigger: string;
  symbol: string; // LaTeX string
  description: string;
}

const shortcuts: Shortcut[] = [
  { trigger: "sqrt(x)", symbol: "\\sqrt{x}", description: "Căn bậc hai của x" },
  { trigger: "x^2", symbol: "x^2", description: "x mũ 2" },
  { trigger: "x^3", symbol: "x^3", description: "x mũ 3" },
  { trigger: "x^n", symbol: "x^n", description: "x mũ n" },
  { trigger: "x_n", symbol: "x_n", description: "Chỉ số dưới n của x" },
  { trigger: "sum", symbol: "\\sum", description: "Tổng sigma" },
  { trigger: "int", symbol: "\\int", description: "Tích phân" },
  { trigger: "delta", symbol: "\\Delta", description: "Delta (biến thiên)" },
  { trigger: "alpha", symbol: "\\alpha", description: "Alpha" },
  { trigger: "beta", symbol: "\\beta", description: "Beta" },
  { trigger: "gamma", symbol: "\\gamma", description: "Gamma" },
  { trigger: "pi", symbol: "\\pi", description: "Số Pi" },
  { trigger: "theta", symbol: "\\theta", description: "Theta" },
  { trigger: "infinity", symbol: "\\infty", description: "Vô cực" },
  { trigger: "=>", symbol: "\\Rightarrow", description: "Suy ra" },
  { trigger: "<=>", symbol: "\\Leftrightarrow", description: "Tương đương" },
  { trigger: "!=", symbol: "\\neq", description: "Không bằng" },
  { trigger: ">=", symbol: "\\geq", description: "Lớn hơn hoặc bằng" },
  { trigger: "<=", symbol: "\\leq", description: "Nhỏ hơn hoặc bằng" },
  { trigger: "approx", symbol: "\\approx", description: "Xấp xỉ" },
  { trigger: "pm", symbol: "\\pm", description: "Cộng hoặc trừ" },
  { trigger: "cdot", symbol: "\\cdot", description: "Phép nhân (dấu chấm)" },
  { trigger: "div", symbol: "\\div", description: "Phép chia" },
  { trigger: "forall", symbol: "\\forall", description: "Với mọi" },
  { trigger: "exists", symbol: "\\exists", description: "Tồn tại" },
  { trigger: "in", symbol: "\\in", description: "Thuộc (phần tử của tập hợp)" },
  { trigger: "notin", symbol: "\\notin", description: "Không thuộc" },
  { trigger: "subset", symbol: "\\subset", description: "Tập con" },
  { trigger: "union", symbol: "\\cup", description: "Hợp (hai tập hợp)" },
  { trigger: "intersect", symbol: "\\cap", description: "Giao (hai tập hợp)" },
];

interface TutorialModalProps {
  onModalToggle?: (isOpen: boolean) => void; // Optional callback for parent
}

export default function TutorialModal({ onModalToggle }: TutorialModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    if (onModalToggle) {
      onModalToggle(true);
    }
  }, [onModalToggle]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (onModalToggle) {
      onModalToggle(false);
    }
  }, [onModalToggle]);

  // Effect to handle Escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
        aria-label="Mở hướng dẫn phím tắt"
        title="Hướng dẫn phím tắt"
      >
        <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-md backdrop-brightness-75"
          onClick={closeModal} // Close on backdrop click
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col p-6 m-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Hướng dẫn Phím tắt Toán học
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Đóng modal"
              >
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body (Placeholder for now) */}
            <div className="overflow-y-auto flex-grow text-sm">
              {/* <p className="text-gray-700">
                Nội dung bảng chú thích phím tắt sẽ được hiển thị ở đây.
              </p> */}
              {/* Table will be added in Phase 2 */}
              <table className="w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border border-gray-300 text-left text-gray-700 font-semibold">
                      Phím tắt (Gợi ý)
                    </th>
                    <th className="p-2 border border-gray-300 text-center text-gray-700 font-semibold">
                      Ký hiệu
                    </th>
                    <th className="p-2 border border-gray-300 text-left text-gray-700 font-semibold">
                      Mô tả
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shortcuts.map((shortcut, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 text-gray-700">
                        <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">
                          {shortcut.trigger}
                        </code>
                      </td>
                      <td className="p-2 border border-gray-300 text-center text-gray-700">
                        <InlineMath math={shortcut.symbol} />
                      </td>
                      <td className="p-2 border border-gray-300 text-gray-700">
                        {shortcut.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer (Optional) */}
            {/* <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Đóng
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
