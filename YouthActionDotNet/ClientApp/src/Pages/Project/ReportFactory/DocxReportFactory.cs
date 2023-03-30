public class DocxReportFactory : IReportFactory {
    public iHeader CreateHeader() {
        return new DocxHeader();
    }
    public iBody CreateBody() {
        return new DocxBody();
    }
    public iFooter CreateFooter() {
        return new DocxFooter();
    }
}
