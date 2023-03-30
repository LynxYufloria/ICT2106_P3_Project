public class PDFReportFactory : IReportFactory {
    public iHeader CreateHeader() {
        return new PDFHeader();
    }
    public iBody CreateBody() {
        return new PDFBody();
    }
    public iFooter CreateFooter() {
        return new PDFFooter();
    }
}