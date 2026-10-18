import { TheoryQuestion } from '../types';

export const THEORY_QUESTIONS: TheoryQuestion[] = [
  {
    id: 'sec_nhan_biet_1',
    title: '1. Nguyên Tắc Sắp Xếp Bảng Tuần Hoàn',
    level: 'nhan_biet',
    levelName: 'Nhận biết',
    competencyTarget: 'Nêu được các nguyên tắc xây dựng bảng tuần hoàn các nguyên tố hoá học',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    contextNote: 'Căn cứ theo mục I - SGK Khoa học tự nhiên Bài 4 (trang 24)',
    paragraphs: [
      {
        id: 'p1',
        parts: [
          { textBefore: 'Năm 1869, nhà bác học người Nga ' },
          { blankId: 'nb_mendeleev' },
          { textBefore: ' đã xây dựng bảng tuần hoàn đầu tiên. Ngày nay, bảng tuần hoàn gồm 118 nguyên tố được xây dựng theo 3 nguyên tắc sau:\n- Nguyên tắc 1: Các nguyên tố hoá học được xếp theo chiều tăng dần của ' },
          { blankId: 'nb_dientich_hatnhan' },
          { textBefore: '.\n- Nguyên tắc 2: Các nguyên tố trong cùng một hàng có cùng ' },
          { blankId: 'nb_solop_electron' },
          { textBefore: ' trong nguyên tử.\n- Nguyên tắc 3: Các nguyên tố trong cùng một cột có ' },
          { blankId: 'nb_tinhchat_giongnhau' },
          { textBefore: '.' }
        ]
      }
    ],
    blanks: [
      {
        id: 'nb_mendeleev',
        acceptedKeywords: ['Men-đê-lê-ép', 'Mendeleev', 'D. I. Mendeleev', 'D.I. Mendeleev'],
        hint: 'Tên nhà bác học người Nga (1834 - 1907)',
        explanation: 'SGK trang 24: Năm 1869, Men-đê-lê-ép (D. I. Mendeleev) đã xây dựng bảng tuần hoàn các nguyên tố hoá học.'
      },
      {
        id: 'nb_dientich_hatnhan',
        acceptedKeywords: ['điện tích hạt nhân', 'Điện tích hạt nhân'],
        hint: 'Đại lượng tăng dần theo chiều từ trái sang phải',
        explanation: 'SGK trang 24: Các nguyên tố hoá học được xếp theo chiều tăng dần của điện tích hạt nhân.'
      },
      {
        id: 'nb_solop_electron',
        acceptedKeywords: ['số lớp electron', 'Số lớp electron'],
        hint: 'Đặc điểm chung của các nguyên tử trong cùng một hàng (chu kì)',
        explanation: 'SGK trang 24: Các nguyên tố trong cùng một hàng có cùng số lớp electron trong nguyên tử.'
      },
      {
        id: 'nb_tinhchat_giongnhau',
        acceptedKeywords: ['tính chất gần giống nhau', 'tính chất tương tự', 'tính chất hoá học gần giống nhau', 'tính chất gần giống'],
        hint: 'Mối tương đồng giữa các nguyên tố trong cùng một cột',
        explanation: 'SGK trang 24: Các nguyên tố trong cùng cột có tính chất gần giống nhau.'
      }
    ]
  },
  {
    id: 'sec_nhan_biet_2',
    title: '2. Cấu Tạo Bảng Tuần Hoàn: Ô, Chu Kì, Nhóm',
    level: 'nhan_biet',
    levelName: 'Nhận biết',
    competencyTarget: 'Mô tả được cấu tạo bảng tuần hoàn gồm: ô nguyên tố, nhóm, chu kì',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    contextNote: 'Căn cứ theo mục II - SGK Khoa học tự nhiên Bài 4 (trang 26 - 28)',
    paragraphs: [
      {
        id: 'p2',
        parts: [
          { textBefore: '1. Ô nguyên tố: Mỗi nguyên tố được xếp vào một ô, cho biết: ' },
          { blankId: 'nb_kh_hoahoc' },
          { textBefore: ', tên nguyên tố, ' },
          { blankId: 'nb_sohieu_nguyentu' },
          { textBefore: ' và ' },
          { blankId: 'nb_khoiluong_nguyentu' },
          { textBefore: '.\n2. Chu kì: Bảng tuần hoàn hiện nay gồm ' },
          { blankId: 'nb_so_chuki' },
          { textBefore: ' chu kì được đánh số từ 1 đến 7. Trong đó, chu kì 1, 2, 3 gọi là ' },
          { blankId: 'nb_chuki_nho' },
          { textBefore: ', chu kì 4, 5, 6, 7 gọi là chu kì lớn. Số thứ tự chu kì bằng ' },
          { blankId: 'nb_stt_chuki' },
          { textBefore: '.\n3. Nhóm: Gồm 8 nhóm A và 8 nhóm B. Số thứ tự của nhóm A bằng ' },
          { blankId: 'nb_stt_nhom_a' },
          { textBefore: '. Nhóm IA là nhóm ' },
          { blankId: 'nb_kimloai_kiem' },
          { textBefore: ' (trừ H), nhóm VIIA là nhóm ' },
          { blankId: 'nb_halogen' },
          { textBefore: ', nhóm VIIIA là nhóm ' },
          { blankId: 'nb_khi_hiem' },
          { textBefore: '.' }
        ]
      }
    ],
    blanks: [
      {
        id: 'nb_kh_hoahoc',
        acceptedKeywords: ['kí hiệu hoá học', 'kí hiệu hóa học', 'Kí hiệu hoá học'],
        hint: 'Chữ cái viết tắt của nguyên tố (ví dụ: H, C, O, Na)',
        explanation: 'SGK trang 26: Ô nguyên tố cho biết: kí hiệu hoá học, tên nguyên tố, số hiệu nguyên tử và khối lượng nguyên tử.'
      },
      {
        id: 'nb_sohieu_nguyentu',
        acceptedKeywords: ['số hiệu nguyên tử', 'Số hiệu nguyên tử'],
        hint: 'Con số ở trên cùng góc ô (chính là số thứ tự)',
        explanation: 'SGK trang 26: Ô nguyên tố cho biết số hiệu nguyên tử (= số đơn vị điện tích hạt nhân = số electron = số proton).'
      },
      {
        id: 'nb_khoiluong_nguyentu',
        acceptedKeywords: ['khối lượng nguyên tử', 'Khối lượng nguyên tử'],
        hint: 'Khối lượng tính bằng đơn vị amu ở dưới tên nguyên tố',
        explanation: 'SGK trang 26: Ô nguyên tố cho biết khối lượng nguyên tử của nguyên tố đó.'
      },
      {
        id: 'nb_so_chuki',
        acceptedKeywords: ['7', 'bảy', '7 chu kì'],
        hint: 'Số lượng các hàng ngang trong bảng tuần hoàn',
        explanation: 'SGK trang 26: Bảng tuần hoàn hiện nay gồm 7 chu kì được đánh số từ 1 đến 7.'
      },
      {
        id: 'nb_chuki_nho',
        acceptedKeywords: ['chu kì nhỏ', 'Chu kì nhỏ'],
        hint: 'Chu kì 1, 2, 3 có ít nguyên tố hơn',
        explanation: 'SGK trang 26: Chu kì 1, 2, 3 được gọi là các chu kì nhỏ; chu kì 4, 5, 6, 7 được gọi là các chu kì lớn.'
      },
      {
        id: 'nb_stt_chuki',
        acceptedKeywords: ['số lớp electron', 'Số lớp electron'],
        hint: 'Đặc điểm vỏ nguyên tử quyết định chu kì',
        explanation: 'SGK trang 27: Trong bảng tuần hoàn, số thứ tự của chu kì bằng số lớp electron của nguyên tử các nguyên tố trong chu kì đó.'
      },
      {
        id: 'nb_stt_nhom_a',
        acceptedKeywords: ['số electron ở lớp ngoài cùng', 'số e ở lớp ngoài cùng', 'số e lớp ngoài cùng', 'số electron lớp ngoài cùng'],
        hint: 'Số e ở lớp vỏ ngoài cùng',
        explanation: 'SGK trang 28: Số thứ tự của nhóm A bằng số electron ở lớp ngoài cùng của nguyên tử các nguyên tố trong nhóm đó.'
      },
      {
        id: 'nb_kimloai_kiem',
        acceptedKeywords: ['kim loại kiềm', 'Kim loại kiềm'],
        hint: 'Tên gọi riêng của nhóm IA (trừ H)',
        explanation: 'SGK trang 28: Nhóm IA có tên riêng là nhóm kim loại kiềm (trừ H).'
      },
      {
        id: 'nb_halogen',
        acceptedKeywords: ['halogen', 'Halogen'],
        hint: 'Tên gọi riêng của nhóm VIIA (F, Cl, Br, I...)',
        explanation: 'SGK trang 28: Nhóm VIIA có tên riêng là nhóm halogen.'
      },
      {
        id: 'nb_khi_hiem',
        acceptedKeywords: ['khí hiếm', 'Khí hiếm'],
        hint: 'Tên gọi riêng của nhóm VIIIA (He, Ne, Ar...)',
        explanation: 'SGK trang 28: Nhóm VIIIA có tên riêng là nhóm khí hiếm.'
      }
    ]
  },
  {
    id: 'sec_thong_hieu_1',
    title: '3. Phân Loại Kim Loại, Phi Kim Và Khí Hiếm',
    level: 'thong_hieu',
    levelName: 'Thông hiểu',
    competencyTarget: 'Sử dụng bảng tuần hoàn để chỉ ra nhóm kim loại, phi kim, khí hiếm và ứng dụng',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    contextNote: 'Căn cứ theo mục III - SGK Khoa học tự nhiên Bài 4 (trang 29 - 31)',
    paragraphs: [
      {
        id: 'p3',
        parts: [
          { textBefore: '- Kim loại: Trong 118 nguyên tố, có hơn ' },
          { blankId: 'th_hon_90' },
          { textBefore: ' nguyên tố là kim loại, ở góc dưới bên ' },
          { blankId: 'th_goc_trai' },
          { textBefore: ' của bảng tuần hoàn và được thể hiện bằng màu ' },
          { blankId: 'th_mau_xanh' },
          { textBefore: '.\n- Phi kim: Có chưa đến ' },
          { blankId: 'th_chua_den_20' },
          { textBefore: ' nguyên tố là phi kim, chủ yếu ở góc trên bên ' },
          { blankId: 'th_goc_phai' },
          { textBefore: ', thể hiện bằng màu ' },
          { blankId: 'th_mau_hong' },
          { textBefore: '.\n- Khí hiếm: Gồm có ' },
          { blankId: 'th_7_nguyento' },
          { textBefore: ' nguyên tố, thuộc nhóm ' },
          { blankId: 'th_nhom_viiia' },
          { textBefore: ', thể hiện màu vàng. Chúng rất bền vững vì có ' },
          { blankId: 'th_8_electron' },
          { textBefore: ' ở lớp ngoài cùng (riêng Helium có ' },
          { blankId: 'th_2_electron' },
          { textBefore: ' electron).\n- Ứng dụng thực tế:\n  + Kim loại ' },
          { blankId: 'th_ungdung_nhom' },
          { textBefore: ' (Al) được dùng làm màng bọc thực phẩm.\n  + Kim loại ' },
          { blankId: 'th_ungdung_dong' },
          { textBefore: ' (Cu) dùng làm lõi dây điện vì dẫn điện tốt.\n  + Khí hiếm ' },
          { blankId: 'th_ungdung_neon' },
          { textBefore: ' (Ne) được ứng dụng trong đèn LED nhiều màu sắc.' }
        ]
      }
    ],
    blanks: [
      {
        id: 'th_hon_90',
        acceptedKeywords: ['90', 'hơn 90', '90 nguyên tố'],
        hint: 'Số lượng nguyên tố kim loại (hơn 90)',
        explanation: 'SGK trang 29: Trong số 118 nguyên tố hoá học đã biết có hơn 90 nguyên tố là kim loại.'
      },
      {
        id: 'th_goc_trai',
        acceptedKeywords: ['trái', 'dưới bên trái', 'bên trái'],
        hint: 'Vị trí của kim loại trên bảng tuần hoàn',
        explanation: 'SGK trang 29: Các nguyên tố kim loại ở góc dưới bên trái của bảng tuần hoàn.'
      },
      {
        id: 'th_mau_xanh',
        acceptedKeywords: ['xanh', 'xanh lam', 'màu xanh', 'xanh biển'],
        hint: 'Màu quy ước của kim loại trong SGK',
        explanation: 'SGK trang 29: Các nguyên tố kim loại được thể hiện bằng màu xanh (xanh lam).'
      },
      {
        id: 'th_chua_den_20',
        acceptedKeywords: ['20', 'chưa đến 20', 'dưới 20'],
        hint: 'Số lượng nguyên tố phi kim (chưa đến 20)',
        explanation: 'SGK trang 30: Trong số 118 nguyên tố hoá học đã biết, có chưa đến 20 nguyên tố là phi kim.'
      },
      {
        id: 'th_goc_phai',
        acceptedKeywords: ['phải', 'trên bên phải', 'bên phải'],
        hint: 'Vị trí của phi kim trên bảng tuần hoàn',
        explanation: 'SGK trang 30: Các nguyên tố phi kim chủ yếu ở góc trên bên phải của bảng.'
      },
      {
        id: 'th_mau_hong',
        acceptedKeywords: ['hồng', 'màu hồng'],
        hint: 'Màu quy ước của phi kim trong SGK',
        explanation: 'SGK trang 30: Các nguyên tố phi kim được thể hiện bằng màu hồng.'
      },
      {
        id: 'th_7_nguyento',
        acceptedKeywords: ['7', 'bảy', '7 nguyên tố'],
        hint: 'Số lượng các nguyên tố khí hiếm',
        explanation: 'SGK trang 31: Trong số 118 nguyên tố đã biết có 7 nguyên tố là khí hiếm.'
      },
      {
        id: 'th_nhom_viiia',
        acceptedKeywords: ['VIIIA', '8A', 'nhóm VIIIA', 'nhóm 8A'],
        hint: 'Nhóm ngoài cùng bên phải',
        explanation: 'SGK trang 31: Các nguyên tố khí hiếm nằm ở nhóm VIIIA và thể hiện màu vàng.'
      },
      {
        id: 'th_8_electron',
        acceptedKeywords: ['8 electron', '8 e', '8', 'tám electron'],
        hint: 'Cấu hình bền vững của khí hiếm',
        explanation: 'SGK trang 31: Nguyên tử của chúng có lớp electron ngoài cùng bền vững gồm 8 electron.'
      },
      {
        id: 'th_2_electron',
        acceptedKeywords: ['2', 'hai', '2 electron', '2 e'],
        hint: 'Trường hợp ngoại lệ duy nhất của Helium',
        explanation: 'SGK trang 31: Lớp electron ngoài cùng bền vững giống khí hiếm là 8 electron hoặc 2 electron (với trường hợp He).'
      },
      {
        id: 'th_ungdung_nhom',
        acceptedKeywords: ['nhôm', 'aluminium', 'Aluminium', 'Al'],
        hint: 'Kim loại màng bọc thực phẩm (Al)',
        explanation: 'SGK trang 29 Hình 4.6: Al (aluminium) ứng dụng làm màng bọc thực phẩm.'
      },
      {
        id: 'th_ungdung_dong',
        acceptedKeywords: ['đồng', 'copper', 'Copper', 'Cu'],
        hint: 'Kim loại làm lõi dây điện (Cu)',
        explanation: 'SGK trang 29 Hình 4.6: Cu (copper) ứng dụng làm lõi dây điện.'
      },
      {
        id: 'th_ungdung_neon',
        acceptedKeywords: ['neon', 'Neon', 'Ne'],
        hint: 'Khí hiếm phát sáng trong đèn LED',
        explanation: 'SGK trang 31: Ne được dùng trong đèn LED.'
      }
    ]
  },
  {
    id: 'sec_van_dung_1',
    title: '4. Vận Dụng: Mối Liên Hệ Số Hiệu Nguyên Tử & Số Proton',
    level: 'van_dung',
    levelName: 'Vận dụng',
    competencyTarget: 'Suy ra được mối liên hệ giữa số hiệu nguyên tử và số proton trong nguyên tử',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    contextNote: 'Căn cứ theo mục II.1 - SGK Khoa học tự nhiên Bài 4 (trang 26)',
    paragraphs: [
      {
        id: 'p4',
        parts: [
          { textBefore: 'Quy tắc vàng liên hệ giữa các đại lượng nguyên tử:\nSố hiệu nguyên tử = Số đơn vị điện tích hạt nhân = Số ' },
          { blankId: 'vd_so_proton' },
          { textBefore: ' trong hạt nhân = Số ' },
          { blankId: 'vd_so_electron' },
          { textBefore: ' trong nguyên tử = Số ' },
          { blankId: 'vd_so_thutu_o' },
          { textBefore: ' của nguyên tố.\n\nÁp dụng giải quyết các tình huống sau:\n1. Nguyên tố Oxygen (ô số 8) có số hiệu nguyên tử là 8. Suy ra trong hạt nhân nguyên tử oxygen có ' },
          { blankId: 'vd_proton_oxygen' },
          { textBefore: ' hạt proton và lớp vỏ có ' },
          { blankId: 'vd_electron_oxygen' },
          { textBefore: ' hạt electron.\n2. Một nguyên tử nguyên tố X có 13 proton trong hạt nhân. Suy ra số hiệu nguyên tử của X là ' },
          { blankId: 'vd_sohieu_al' },
          { textBefore: ', nguyên tố X nằm ở ô số ' },
          { blankId: 'vd_oso_al' },
          { textBefore: ', đó chính là nguyên tố ' },
          { blankId: 'vd_ten_al' },
          { textBefore: ' (kí hiệu: Al).' }
        ]
      }
    ],
    blanks: [
      {
        id: 'vd_so_proton',
        acceptedKeywords: ['proton', 'hạt proton', 'Proton'],
        hint: 'Hạt mang điện tích dương trong hạt nhân',
        explanation: 'SGK trang 26: Số hiệu nguyên tử = Số đơn vị điện tích hạt nhân = Số proton.'
      },
      {
        id: 'vd_so_electron',
        acceptedKeywords: ['electron', 'hạt electron', 'e', 'Electron'],
        hint: 'Hạt mang điện tích âm ở lớp vỏ nguyên tử',
        explanation: 'SGK trang 26: Số hiệu nguyên tử = Số electron trong nguyên tử.'
      },
      {
        id: 'vd_so_thutu_o',
        acceptedKeywords: ['thứ tự', 'thứ tự của nguyên tố', 'thứ tự ô', 'thứ tự của ô'],
        hint: 'Vị trí ô trong bảng tuần hoàn',
        explanation: 'SGK trang 26: Số hiệu nguyên tử chính là số thứ tự của nguyên tố trong bảng tuần hoàn.'
      },
      {
        id: 'vd_proton_oxygen',
        acceptedKeywords: ['8', 'tám'],
        hint: 'Số proton = số hiệu nguyên tử (8)',
        explanation: 'SGK trang 26: Quan sát ô số 8 (oxygen), số hiệu nguyên tử là 8 nên có 8 proton.'
      },
      {
        id: 'vd_electron_oxygen',
        acceptedKeywords: ['8', 'tám'],
        hint: 'Số electron = số proton = 8',
        explanation: 'SGK trang 26: Số electron trong nguyên tử oxygen bằng 8 (nguyên tử trung hòa về điện).'
      },
      {
        id: 'vd_sohieu_al',
        acceptedKeywords: ['13', 'mười ba'],
        hint: 'Số hiệu = số proton = 13',
        explanation: 'Số proton = 13 => Số hiệu nguyên tử của nguyên tố đó bằng 13.'
      },
      {
        id: 'vd_oso_al',
        acceptedKeywords: ['13', 'mười ba'],
        hint: 'Số thứ tự ô = số hiệu nguyên tử = 13',
        explanation: 'Số thứ tự ô bằng số hiệu nguyên tử nên nằm ở ô số 13.'
      },
      {
        id: 'vd_ten_al',
        acceptedKeywords: ['Aluminium', 'nhôm', 'aluminium', 'Al'],
        hint: 'Nguyên tố ở ô số 13 trong bảng tuần hoàn',
        explanation: 'SGK trang 25: Ô số 13 là Aluminium (nhôm), kí hiệu hoá học là Al.'
      }
    ]
  },
  {
    id: 'sec_van_dung_2',
    title: '5. Vận Dụng: Tra Cứu Nguyên Tố Tương Ứng Với Khối Lượng Nguyên Tử (KLNT)',
    level: 'van_dung',
    levelName: 'Vận dụng',
    competencyTarget: 'Tìm được các nguyên tố hoá học tương ứng với khối lượng nguyên tử (KLNT) của nó',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    contextNote: 'Căn cứ theo bảng tuần hoàn trang 25 & hình 4.2 - 4.3 SGK KHTN Bài 4',
    paragraphs: [
      {
        id: 'p5',
        parts: [
          { textBefore: 'Dựa vào bảng tuần hoàn, hãy xác định tên hoặc kí hiệu hoá học của các nguyên tố khi biết khối lượng nguyên tử (KLNT làm tròn):\n- Nguyên tố có KLNT = 1 amu là ' },
          { blankId: 'vd_klnt_1' },
          { textBefore: ' (kí hiệu: H).\n- Nguyên tố có KLNT = 12 amu là ' },
          { blankId: 'vd_klnt_12' },
          { textBefore: ' (kí hiệu: C).\n- Nguyên tố có KLNT = 16 amu là ' },
          { blankId: 'vd_klnt_16' },
          { textBefore: ' (kí hiệu: O).\n- Nguyên tố có KLNT = 23 amu là ' },
          { blankId: 'vd_klnt_23' },
          { textBefore: ' (kí hiệu: Na).\n- Nguyên tố có KLNT = 27 amu là ' },
          { blankId: 'vd_klnt_27' },
          { textBefore: ' (kí hiệu: Al).\n- Nguyên tố có KLNT = 56 amu là ' },
          { blankId: 'vd_klnt_56' },
          { textBefore: ' (kí hiệu: Fe).\n- Nguyên tố có KLNT = 64 amu là ' },
          { blankId: 'vd_klnt_64' },
          { textBefore: ' (kí hiệu: Cu).\n- Nguyên tố phi kim có KLNT = 35,5 amu là ' },
          { blankId: 'vd_klnt_35_5' },
          { textBefore: ' (kí hiệu: Cl).' }
        ]
      }
    ],
    blanks: [
      {
        id: 'vd_klnt_1',
        acceptedKeywords: ['Hydrogen', 'hydrogen', 'Hiđro', 'hidro'],
        hint: 'Nguyên tố nhẹ nhất trong vũ trụ (KLNT = 1)',
        explanation: 'SGK trang 25: Nguyên tố ở ô số 1 có KLNT = 1 là Hydrogen (H).'
      },
      {
        id: 'vd_klnt_12',
        acceptedKeywords: ['Carbon', 'carbon', 'Cacbon', 'cacbon'],
        hint: 'Nguyên tố của sự sống và than hoa (KLNT = 12)',
        explanation: 'SGK trang 25, hình 4.1: Nguyên tố ở ô số 6 có KLNT = 12 là Carbon (C).'
      },
      {
        id: 'vd_klnt_16',
        acceptedKeywords: ['Oxygen', 'oxygen', 'Oxi', 'oxi'],
        hint: 'Nguyên tố khí duy trì hô hấp (KLNT = 16)',
        explanation: 'SGK trang 26, hình 4.2: Ô số 8 có KLNT = 16 là Oxygen (O).'
      },
      {
        id: 'vd_klnt_23',
        acceptedKeywords: ['Sodium', 'sodium', 'Natri', 'natri'],
        hint: 'Kim loại kiềm trong muối ăn (KLNT = 23)',
        explanation: 'SGK trang 25: Nguyên tố ở ô số 11 có KLNT = 23 là Sodium (Na).'
      },
      {
        id: 'vd_klnt_27',
        acceptedKeywords: ['Aluminium', 'aluminium', 'Nhôm', 'nhôm'],
        hint: 'Kim loại màng bọc thức ăn (KLNT = 27)',
        explanation: 'SGK trang 25, 29: Ô số 13 có KLNT = 27 là Aluminium (Al).'
      },
      {
        id: 'vd_klnt_56',
        acceptedKeywords: ['Iron', 'iron', 'Sắt', 'sắt'],
        hint: 'Kim loại làm khung xây dựng (KLNT = 56)',
        explanation: 'SGK trang 25, 29: Ô số 26 có KLNT = 56 là Iron (Fe).'
      },
      {
        id: 'vd_klnt_64',
        acceptedKeywords: ['Copper', 'copper', 'Đồng', 'đồng'],
        hint: 'Kim loại làm lõi dây điện dẫn điện tốt (KLNT = 64)',
        explanation: 'SGK trang 25, 29: Ô số 29 có KLNT = 64 là Copper (Cu).'
      },
      {
        id: 'vd_klnt_35_5',
        acceptedKeywords: ['Chlorine', 'chlorine', 'Clo', 'clo'],
        hint: 'Phi kim halogen khử trùng nước sinh hoạt (KLNT = 35,5)',
        explanation: 'SGK trang 25, 30: Ô số 17 có KLNT = 35,5 là Chlorine (Cl).'
      }
    ]
  }
];
