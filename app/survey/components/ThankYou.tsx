"use client";

import Link from "next/link";

const ThankYou = () => {
  return (
    <div className="text-center py-16">
        <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Cảm ơn bạn!</h1>
      <p className="mt-4 text-base text-gray-600">
        Chúng tôi đã nhận được câu trả lời của bạn. Phản hồi của bạn rất quan trọng để chúng tôi cải thiện The AllEd.
      </p>
      <div className="mt-10">
        <Link href="/" className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default ThankYou; 