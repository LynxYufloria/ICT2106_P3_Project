public class XLSReportFactory : IReportFactory {

    public iHeader CreateHeader() {
        return new XLSHeader();
    }
    public iBody CreateBody() {
        return new XLSBody();
    }
    public iFooter CreateFooter() {
        return new XLSFooter();
    }
}