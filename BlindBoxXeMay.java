import java.util.Scanner;

class BlindBox {
    private String ma;
    private int gia;
    private String mauSac;
    private int loai; // 1-BabyThree, 2-Labubu

    // Constructor with parameters
    public BlindBox(String ma, int gia, String mauSac, int loai) {
        this.ma = ma;
        this.gia = gia;
        this.mauSac = mauSac;
        this.loai = loai;
    }

    // Default constructor
    public BlindBox() {}

    // Getters and Setters
    public String getMa() { return ma; }
    public void setMa(String ma) { this.ma = ma; }
    public int getGia() { return gia; }
    public void setGia(int gia) { this.gia = gia; }
    public String getMauSac() { return mauSac; }
    public void setMauSac(String mauSac) { this.mauSac = mauSac; }
    public int getLoai() { return loai; }
    public void setLoai(int loai) { this.loai = loai; }

    // Method to print information
    public void inThongTin() {
        System.out.println("BlindBox [ma=" + ma + ", gia=" + gia + ", mauSac=" + mauSac + ", loai=" + (loai == 1 ? "BabyThree" : "Labubu") + "]");
    }
}

class XeMay {
    private String ma;
    private int gia;
    private String hang;
    private String mauSac;
    private int namSX;
    private int phanKhoi;

    // Default constructor
    public XeMay() {}

    // Getters and Setters
    public String getMa() { return ma; }
    public void setMa(String ma) { this.ma = ma; }
    public int getGia() { return gia; }
    public void setGia(int gia) { this.gia = gia; }
    public String getHang() { return hang; }
    public void setHang(String hang) { this.hang = hang; }
    public String getMauSac() { return mauSac; }
    public void setMauSac(String mauSac) { this.mauSac = mauSac; }
    public int getNamSX() { return namSX; }
    public void setNamSX(int namSX) { this.namSX = namSX; }
    public int getPhanKhoi() { return phanKhoi; }
    public void setPhanKhoi(int phanKhoi) { this.phanKhoi = phanKhoi; }

    // Method to print information
    public void inThongTin() {
        System.out.println("XeMay [ma=" + ma + ", gia=" + gia + ", hang=" + hang + ", mauSac=" + mauSac + ", namSX=" + namSX + ", phanKhoi=" + phanKhoi + "]");
    }
}

public class BlindBoxXeMay {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;

        do {
            System.out.println("Menu:");
            System.out.println("1. BlindBox");
            System.out.println("2. Xe May");
            System.out.println("0. Thoát");
            System.out.print("Chọn: ");
            choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    System.out.print("Nhập mã: ");
                    String maBlindBox = scanner.nextLine();
                    System.out.print("Nhập giá: ");
                    int giaBlindBox = scanner.nextInt();
                    scanner.nextLine(); // Consume newline
                    System.out.print("Nhập màu sắc: ");
                    String mauSacBlindBox = scanner.nextLine();
                    System.out.print("Nhập loại (1-BabyThree, 2-Labubu): ");
                    int loaiBlindBox = scanner.nextInt();
                    BlindBox blindBox = new BlindBox(maBlindBox, giaBlindBox, mauSacBlindBox, loaiBlindBox);
                    blindBox.inThongTin();
                    break;

                case 2:
                    XeMay xeMay = new XeMay();
                    System.out.print("Nhập mã: ");
                    xeMay.setMa(scanner.nextLine());
                    System.out.print("Nhập giá: ");
                    xeMay.setGia(scanner.nextInt());
                    scanner.nextLine(); // Consume newline
                    System.out.print("Nhập hãng: ");
                    xeMay.setHang(scanner.nextLine());
                    System.out.print("Nhập màu sắc: ");
                    xeMay.setMauSac(scanner.nextLine());
                    System.out.print("Nhập năm sản xuất: ");
                    xeMay.setNamSX(scanner.nextInt());
                    System.out.print("Nhập phân khối: ");
                    xeMay.setPhanKhoi(scanner.nextInt());
                    xeMay.inThongTin();
                    break;

                case 0:
                    System.out.println("Thoát chương trình.");
                    break;

                default:
                    System.out.println("Lựa chọn không hợp lệ. Vui lòng thử lại.");
            }
        } while (choice != 0);

        scanner.close();
    }
}
