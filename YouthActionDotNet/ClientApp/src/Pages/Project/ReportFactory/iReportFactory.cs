public interface IReportFactory {
    iHeader CreateHeader();
    iBody CreateBody();
    iFooter CreateFooter();
}
