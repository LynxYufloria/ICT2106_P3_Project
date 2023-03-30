using System.Collections.Generic;

public class DocxBody : iBody {

   private List<string[]> rows = new List<string[]>();
   public void AddRow(string[] rowData) {
      rows.Add(rowData);
   }


}