export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  atomicMass: number;
  period: number;
  group: string;
  category: 'metal' | 'nonmetal' | 'noble_gas';
  categoryVi: 'Kim loại' | 'Phi kim' | 'Khí hiếm';
  colorClass: string;
  applicationVi?: string;
  valenceElectrons?: number;
}

export const PERIODIC_ELEMENTS: ElementData[] = [
  // Period 1
  { number: 1, symbol: 'H', name: 'Hydrogen', atomicMass: 1, period: 1, group: 'IA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', valenceElectrons: 1 },
  { number: 2, symbol: 'He', name: 'Helium', atomicMass: 4, period: 1, group: 'VIIIA', category: 'noble_gas', categoryVi: 'Khí hiếm', colorClass: 'bg-amber-100 border-amber-400 text-amber-900', applicationVi: 'Bơm khinh khí cầu, khí lặn', valenceElectrons: 2 },

  // Period 2
  { number: 3, symbol: 'Li', name: 'Lithium', atomicMass: 7, period: 2, group: 'IA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', valenceElectrons: 1 },
  { number: 4, symbol: 'Be', name: 'Beryllium', atomicMass: 9, period: 2, group: 'IIA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', valenceElectrons: 2 },
  { number: 5, symbol: 'B', name: 'Boron', atomicMass: 11, period: 2, group: 'IIIA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', valenceElectrons: 3 },
  { number: 6, symbol: 'C', name: 'Carbon', atomicMass: 12, period: 2, group: 'IVA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Lõi bút chì, kim cương, than hoa', valenceElectrons: 4 },
  { number: 7, symbol: 'N', name: 'Nitrogen', atomicMass: 14, period: 2, group: 'VA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Thành phần chính của không khí (78%)', valenceElectrons: 5 },
  { number: 8, symbol: 'O', name: 'Oxygen', atomicMass: 16, period: 2, group: 'VIA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Duy trì sự sống, sự hô hấp và sự cháy', valenceElectrons: 6 },
  { number: 9, symbol: 'F', name: 'Fluorine', atomicMass: 19, period: 2, group: 'VIIA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', valenceElectrons: 7 },
  { number: 10, symbol: 'Ne', name: 'Neon', atomicMass: 20, period: 2, group: 'VIIIA', category: 'noble_gas', categoryVi: 'Khí hiếm', colorClass: 'bg-amber-100 border-amber-400 text-amber-900', applicationVi: 'Đèn quảng cáo LED neon nhiều màu', valenceElectrons: 8 },

  // Period 3
  { number: 11, symbol: 'Na', name: 'Sodium', atomicMass: 23, period: 3, group: 'IA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Thành phần muối ăn NaCl', valenceElectrons: 1 },
  { number: 12, symbol: 'Mg', name: 'Magnesium', atomicMass: 24, period: 3, group: 'IIA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Pháo hoa, hợp kim nhẹ', valenceElectrons: 2 },
  { number: 13, symbol: 'Al', name: 'Aluminium', atomicMass: 27, period: 3, group: 'IIIA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Màng bọc thực phẩm, khung cửa sổ', valenceElectrons: 3 },
  { number: 14, symbol: 'Si', name: 'Silicon', atomicMass: 28, period: 3, group: 'IVA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Chíp bán dẫn điện tử', valenceElectrons: 4 },
  { number: 15, symbol: 'P', name: 'Phosphorus', atomicMass: 31, period: 3, group: 'VA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Đầu diêm, phân bón lân', valenceElectrons: 5 },
  { number: 16, symbol: 'S', name: 'Sulfur', atomicMass: 32, period: 3, group: 'VIA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Sản xuất sulfuric acid, diêm sinh màu vàng', valenceElectrons: 6 },
  { number: 17, symbol: 'Cl', name: 'Chlorine', atomicMass: 35.5, period: 3, group: 'VIIA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Khử trùng nước sinh hoạt, chất tẩy trắng', valenceElectrons: 7 },
  { number: 18, symbol: 'Ar', name: 'Argon', atomicMass: 40, period: 3, group: 'VIIIA', category: 'noble_gas', categoryVi: 'Khí hiếm', colorClass: 'bg-amber-100 border-amber-400 text-amber-900', applicationVi: 'Khí trơ trong bóng đèn dây tóc', valenceElectrons: 8 },

  // Period 4 Key Elements
  { number: 19, symbol: 'K', name: 'Potassium', atomicMass: 39, period: 4, group: 'IA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', valenceElectrons: 1 },
  { number: 20, symbol: 'Ca', name: 'Calcium', atomicMass: 40, period: 4, group: 'IIA', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Thành phần cấu tạo nên xương và răng', valenceElectrons: 2 },
  { number: 26, symbol: 'Fe', name: 'Iron', atomicMass: 56, period: 4, group: 'VIIIB', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Khung công trình xây dựng, thép, cầu đường' },
  { number: 29, symbol: 'Cu', name: 'Copper', atomicMass: 64, period: 4, group: 'IB', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Lõi dây dẫn điện, ống đồng dẫn nhiệt' },
  { number: 30, symbol: 'Zn', name: 'Zinc', atomicMass: 65, period: 4, group: 'IIB', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Mạ kẽm chống gỉ, tôn lợp nhà' },
  { number: 35, symbol: 'Br', name: 'Bromine', atomicMass: 80, period: 4, group: 'VIIA', category: 'nonmetal', categoryVi: 'Phi kim', colorClass: 'bg-rose-100 border-rose-400 text-rose-900', applicationVi: 'Chất lỏng màu nâu đỏ ở điều kiện thường' },
  { number: 36, symbol: 'Kr', name: 'Krypton', atomicMass: 84, period: 4, group: 'VIIIA', category: 'noble_gas', categoryVi: 'Khí hiếm', colorClass: 'bg-amber-100 border-amber-400 text-amber-900' },

  // Special Highlighted Elements from textbook
  { number: 47, symbol: 'Ag', name: 'Silver', atomicMass: 108, period: 5, group: 'IB', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Đồ trang sức, dẫn điện siêu tốt' },
  { number: 79, symbol: 'Au', name: 'Gold', atomicMass: 197, period: 6, group: 'IB', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Đồ trang sức quý giá, vi mạch điện tử' },
  { number: 80, symbol: 'Hg', name: 'Mercury', atomicMass: 201, period: 6, group: 'IIB', category: 'metal', categoryVi: 'Kim loại', colorClass: 'bg-cyan-100 border-cyan-400 text-cyan-900', applicationVi: 'Kim loại thể lỏng duy nhất ở nhiệt độ thường' },
  { number: 86, symbol: 'Rn', name: 'Radon', atomicMass: 222, period: 6, group: 'VIIIA', category: 'noble_gas', categoryVi: 'Khí hiếm', colorClass: 'bg-amber-100 border-amber-400 text-amber-900' }
];
