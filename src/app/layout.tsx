import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "诡秘之主 · 雾中余烬 | 在线互动冒险（非官方同人）",
  description:
    "以《诡秘之主》为蓝本的非官方、非商业粉丝同人互动冒险：饮下魔药，扮演序列，在廷根的雾夜里加入值夜者，调查安提哥努斯笔记、钟楼失踪案与绯红假面舞会——守住你的理智，直到灰雾之上的注视降临。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#05060a] text-[#d8d3c8] antialiased">{children}</body>
    </html>
  );
}
