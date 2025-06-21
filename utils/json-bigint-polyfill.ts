// src/utils/json-bigint-polyfill.ts

// 👇 ปรับให้ TypeScript เข้าใจว่ากำลังขยาย global type
export {}; // <-- สำคัญมาก ทำให้ไฟล์นี้เป็นโมดูล

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// 👇 เพิ่ม toJSON ให้ BigInt ตอน runtime
if (!BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}
