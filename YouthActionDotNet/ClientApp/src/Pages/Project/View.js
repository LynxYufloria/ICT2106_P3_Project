import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Loading } from "../../Components/appCommon";
import DatapageLayout from "../PageLayoutEmpty";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Overlay } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router";
import { Chart } from "chart.js";
import * as d3 from "d3";
import cloud from "d3-cloud";
import { Pie, Bar, Line } from "react-chartjs-2";
import { CreatePDFButton } from "./Project";
import { CreateDocxButton } from "./Project";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import { StdButton } from "../../Components/common";
//feedback charts for satisfaction and recommend
const FeedbackCharts = ({ satisfactionData, recommendData }) => {
  const satisfactionChartRef = useRef(null);
  const recommendChartRef = useRef(null);

  const generateSatisfactionChartData = (data) => {
    const labels = [
      "Very unsatisfied",
      "Somewhat unsatisfied",
      "Neutral",
      "Somewhat satisfied",
      "Very satisfied",
    ];
    const counts = [0, 0, 0, 0, 0];

    data.forEach((satisfaction) => {
      counts[satisfaction - 1]++;
    });

    return {
      labels,
      datasets: [
        {
          label: "Satisfaction",
          data: counts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 205, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        },
      ],
      plugins: [
        {
          id: "whiteBackground",
          beforeDraw: (chartInstance) => {
            const ctx = chartInstance.canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(
              0,
              0,
              chartInstance.canvas.width,
              chartInstance.canvas.height
            );
          },
        },
      ],
    };
  };

  const generateRecommendChartData = (data) => {
    const labels = ["Yes", "No"];
    const counts = [0, 0];

    data.forEach((recommend) => {
      counts[recommend ? 0 : 1]++;
    });

    return {
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
      plugins: [
        {
          id: "whiteBackground",
          beforeDraw: (chartInstance) => {
            const ctx = chartInstance.canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(
              0,
              0,
              chartInstance.canvas.width,
              chartInstance.canvas.height
            );
          },
        },
      ],
    };
  };

  useEffect(() => {
    if (satisfactionChartRef.current && recommendChartRef.current) {
      const satisfactionChart = new Chart(satisfactionChartRef.current, {
        type: "bar",
        data: generateSatisfactionChartData(satisfactionData),
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      const recommendChart = new Chart(recommendChartRef.current, {
        type: "pie",
        data: generateRecommendChartData(recommendData),
        options: {
          height: 20,
          width: 20,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        satisfactionChart.destroy();
        recommendChart.destroy();
      };
    }
  }, [
    satisfactionChartRef,
    recommendChartRef,
    satisfactionData,
    recommendData,
  ]);

  return (


    <div style={{ display: "flex" }}>
      <div
        style={{
          width: 800,
          marginLeft: "50px",
          marginRight: "50px",
          overflow: "auto",
          display: "inline-block",
        }}
      >
        <h3>Satisfaction Data</h3>
        <canvas ref={satisfactionChartRef} />
      </div>
      <div
        style={{
          width: 500,
          height: 400,
          marginLeft: "100px",
          marginRight: "50px",
          display: "inline-block",
        }}
      >
        <h3>Recommend Data</h3>
        <canvas ref={recommendChartRef} />
      </div>
    </div>
  );
};

//feedback word cloud for feedback text
const FeedbackWordCloud = ({ feedbackTextData }) => {
  const svgRef = useRef();
  const [wordArray, setWordArray] = useState([]);

  useEffect(() => {
    const allFeedbackText = Object.values(feedbackTextData).flat();

    const words = allFeedbackText.reduce((acc, feedbackText) => {
      const wordsInText = feedbackText.split(/\s+/);
      wordsInText.forEach((word) => {
        const cleanedWord = word.replace(/[^\w]/g, "").toLowerCase();
        if (cleanedWord) {
          if (acc[cleanedWord]) {
            acc[cleanedWord]++;
          } else {
            acc[cleanedWord] = 1;
          }
        }
      });
      return acc;
    }, {});

    const newWordArray = Object.keys(words).map((word) => {
      return { text: word, size: words[word] * 20 };
    });

    setWordArray(newWordArray);
  }, [feedbackTextData]);

  useEffect(() => {
    if (!wordArray.length) {
      return;
    }
    const drawWordCloud = (words) => {
      const width = 1580;
      const height = 160;

      const svg = d3.select(svgRef.current);
      svg.attr("width", width).attr("height", height);

      const layout = cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => (Math.random() - 0.5) * 90)
        .fontSize((d) => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        svg.selectAll("g").remove(); // Clear the previous words

        svg
          .append("g")
          .attr(
            "transform",
            `translate(${layout.size()[0] / 2 + 60}, ${layout.size()[1] / 2})`
          )
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", (d) => `${d.size}px`)
          .style("fill", () => `hsl(${Math.random() * 360}, 100%, 50%)`)
          .attr("text-anchor", "middle")
          .attr("transform", (d) => `translate(${[d.x, d.y]})`) // Removed rotation
          .text((d) => d.text);
      }
    };

    drawWordCloud(wordArray);
  }, [wordArray]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default class View extends React.Component {
  state = {
    content: null,
    headers: [],
    loading: true,
    settings: {},
    volunteer: [],
    selectedVolunteer: [],
    satisfactionData: {},
    recommendData: {},
    feedbackTextData: {},
    error: "",
  };

  settings = {
    title: "Project",
    primaryColor: "#a6192e",
    accentColor: "#94795d",
    textColor: "#ffffff",
    textColorInvert: "#606060",
    api: "/api/Project/",
  };
  volunteersettings = {
    title: "Volunteers",
    primaryColor: "#a6192e",
    accentColor: "#94795d",
    textColor: "#ffffff",
    textColorInvert: "#606060",
    api: "/api/Volunteer/",
  };

  has = {
    Create: true,
    Generate: false,
    Delete: false,
  };

  async componentDidMount() {
    await this.getContent().then((content) => {
      // console.log(content);
      this.setState({
        content: content,
      });
    });
    await this.getVolunteerData().then((volunteer) => {
      console.log("View -> componentDidMount -> volunteer", volunteer);
      const list = volunteer?.data?.filter(
        (item) => item?.ApprovalStatus === "Approved"
      );
      this.setState({
        volunteer: list,
      });
    });
    await this.getSettings().then((settings) => {
      // console.log(settings);
      this.setState({
        settings: settings,
      });
    });

    //retrieving feedback data
    const feedbackApi = "/api/Feedback/All";
    fetch(feedbackApi)
      .then((response) => response.json())
      .then((feedback) => {
        console.log("Fetched data: ", feedback);
        const feedbackData = feedback.data.map((feedbackItem) => {
          return {
            feedbackId: feedbackItem.FeedbackId,
            projectName: feedbackItem.ProjectName,
            satisfaction: feedbackItem.Satisfaction,
            recommend: feedbackItem.Recommend,
            feedbackText: feedbackItem.FeedbackText,
          };
        });
        console.log(feedbackData);

        //retrieving satisfaction data
        const satisfactionData = {};
        feedbackData.forEach((feedbackItem) => {
          const projectName = feedbackItem.projectName;
          const satisfaction = feedbackItem.satisfaction;
          if (!satisfactionData[projectName]) {
            satisfactionData[projectName] = [satisfaction];
          } else {
            satisfactionData[projectName].push(satisfaction);
          }
        });

        //retrieving recommend data
        const recommendData = {};
        feedbackData.forEach((feedbackItem) => {
          const projectName = feedbackItem.projectName;
          const recommend = feedbackItem.recommend;
          if (!recommendData[projectName]) {
            recommendData[projectName] = [recommend];
          } else {
            recommendData[projectName].push(recommend);
          }
        });

        //checking the details for the recommend data for each project
        Object.entries(recommendData).forEach(
          ([projectName, projectRecommendData]) => {
            console.log(
              `Project name: ${projectName}, Recommend data:`,
              projectRecommendData
            );
          }
        );

        //retrieving feedback text data
        const feedbackTextData = {};
        feedbackData.forEach((feedbackItem) => {
          const projectName = feedbackItem.projectName;
          const feedbackText = feedbackItem.feedbackText;
          if (!feedbackTextData[projectName]) {
            feedbackTextData[projectName] = [feedbackText];
          } else {
            feedbackTextData[projectName].push(feedbackText);
          }
        });

        // Set the processed data to the component state
        this.setState({
          satisfactionData: satisfactionData,
          recommendData: recommendData,
          feedbackTextData: feedbackTextData,
        });

        console.log("this is satisfaction data", satisfactionData);
        console.log("this is recommend data", recommendData);
        console.log("this is feedback text data", feedbackTextData);
        console.log("Processed state: ", this.state);
      })
      .catch((error) => {
        console.error(error);
      });

    this.setState({
      loading: false,
    });
  }

  getSettings = async () => {
    // fetches http://...:5001/api/User/Settings
    return fetch(this.settings.api + "Settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // console.log(res);
      return res.json();
    });
  };

  getContent = async () => {
    return fetch(this.settings.api + "All", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };
  getVolunteerData = async () => {
    return fetch(this.volunteersettings.api + "All", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };
  update = async (data) => {
    // console.log("===;[;[;[", data);
    return fetch(`${this.settings.api}UpdateAndFetch/${data.ProjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      return res.json();
    });
  };

  //   delete = async (data) => {
  //     await fetch(`https://localhost:5001/api/Project/Delete/${data}`, {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //     }).then(async (res) => {
  //       location.href = `/Project`;
  //     });
  //   };
  delete = (data) => {
    window.location.href = `/Project/${data}`;
  };

  setVolunteerList = (vol, add) => {
    if (add) {
      this.setState({
        selectedVolunteer: [...this.state.selectedVolunteer, vol],
      });
    } else {
      this.setState({
        selectedVolunteer: this.state.selectedVolunteer.filter(
          (item) => item.UserId !== vol.UserId
        ),
      });
    }
  };

  //SET OR ADD VOLUNTEER

  setVolunteer = (vol) => {
    const id = window.location.href.split("/")[5];
    const Project = this.state.content.data.filter((item) => {
      return item.ProjectId === id;
    });

    const projectVolunteers = JSON.parse(Project[0]?.ProjectVolunteer || "[]");

    const data = {
      ...Project[0],
      ProjectId: Project[0]?.ProjectId,
      ProjectVolunteer: JSON.stringify([
        ...projectVolunteers,
        ...this.state.selectedVolunteer,
      ]),
    };
    this.handleUpdate(data);
  };

  //DELETE VOLUNTEER
  deleteVolunteer = (vol) => {
    const id = window.location.href.split("/")[5];
    const Project = this.state.content.data.filter((item) => {
      return item.ProjectId === id;
    });

    const filteredVolunteers = JSON.parse(
      Project[0]?.ProjectVolunteer || "[]"
    ).filter((item) => item?.UserId !== vol?.UserId);
    const data = {
      ...Project[0],
      ProjectId: Project[0]?.ProjectId,
      ProjectVolunteer: JSON.stringify(filteredVolunteers),
    };
    this.handleUpdate(data);
  };
  handleUpdate = async (data) => {
    await this.update(data).then((content) => {
      if (content.success) {
        this.setState({
          error: "",
        });
        window.location.reload(true);
        console.log(data);
        return true;
      } else {
        this.setState({
          error: content.message,
        });
        return false;
      }
    });
  };

  handleDelete = async (data) => {
    await this.delete(data).then((content) => {
      if (content.success) {
        this.setState({
          error: "",
        });
        return true;
      } else {
        this.setState({
          error: content.message,
        });
        return false;
      }
    });
  };

  requestRefresh = async () => {
    this.setState({
      loading: true,
    });
    await this.getContent().then((content) => {
      // console.log(content);
      this.setState({
        content: content,
        loading: false,
      });
    });
  };

  requestError = async (error) => {
    this.setState({
      error: error,
    });
  };

  render() {
    if (this.state.loading) {
      return <Loading></Loading>;
    } else {
      // console.log(this.state.content.data);

      const id = window.location.href.split("/")[5];
      const data = this.state.content.data.filter((item) => {
        return item.ProjectId == id;
      });

      //retrieving data for the project
      //retrieving name of the project
      const projectData = data.length > 0 ? data[0] : {};
      const projectName = projectData.ProjectName || "";
      console.log("Project name:", projectName);

      //retrieving satisfaction data for the project
      //retrieving recommend data for the project
      //retrieving feedback text data for the project
      const satisfactionDataForProject =
        this.state.satisfactionData[projectName] || [];
      const recommendDataForProject =
        this.state.recommendData[projectName] || [];
      const feedbackTextDataForProject =
        this.state.feedbackTextData[projectName] || [];

      console.log("Satisfaction data: ", satisfactionDataForProject);
      console.log("Recommend data: ", recommendDataForProject);
      console.log("Feedback data: ", feedbackTextDataForProject);

      return (
        <DatapageLayout
          settings={this.settings}
          fieldSettings={this.state.settings.data.FieldSettings}
          headers={this.state.settings.data.ColumnSettings}
          data={data}
          updateHandle={this.handleUpdate}
          requestRefresh={this.requestRefresh}
          error={this.state.error}
          permissions={this.props.permissions}
          requestError={this.requestError}
          has={this.has}
        >
          <div id="pdffile">
            <ProjectTable data={data[0]} delete={this.delete} />
            <br />
            <h1>Customer Feedback</h1>
            <br />
            <br />
            <div>
              <FeedbackCharts
                satisfactionData={satisfactionDataForProject}
                recommendData={recommendDataForProject}
                feedbackTextData={feedbackTextDataForProject}
              />
              <br />
              <br />
              <h3 style={{ position: "absolute", left: "60px" }}>
                Feedback Word Cloud
              </h3>
              <div id="wordcloud">
              <FeedbackWordCloud
                feedbackTextData={feedbackTextDataForProject}
              />
              </div>
            </div>
            <div id="addvolunteertable">
            <VolunteerTable
              deleteVolunteer={this.deleteVolunteer}
              data={data[0]}
            />
            </div>
          </div>
          <h1 style={{ marginTop: "100px", marginBottom: "20px" }}>
            Add Volunteers to this Project
          </h1>
          {console.log(this.state.volunteer)}
          <div id="addvolunteertable">
          <TableButton
            volunteerData={this.state.volunteer}
            setVolunteerList={this.setVolunteerList}
            deleteVolunteer={this.deleteVolunteer}
            data={data[0]}
            volunteerList={this.state.selectedVolunteer}
          />
          </div>

          <CreatePDFButton2 />
          <br></br>
          <CreateDocxButton2 />
          <br></br>
          <StdButton>Generate XLS</StdButton>

          <br></br>
          <Button onClick={() => this.setVolunteer()}>Submit</Button>
        </DatapageLayout>
      );
    }
  }
}
export const CreateDocxButton2 = (props) => {
  const generateDocx = (element, filename = "") => {
    const canvas = document.getElementsByTagName("canvas");

    const projecttable = document.getElementById("projecttable");
    const wordcloud = document.getElementById("wordcloud");
    // Use html2canvas to generate a canvas element from the table
    html2canvas(projecttable).then((tableCanvas) => {
      const tableImgData = tableCanvas.toDataURL("image/png", 1.0);

      const imgData = canvas[0].toDataURL("image/png", 1.0);
      const imgData2 = canvas[1].toDataURL("image/png", 1.0);
      const imgData3 = canvas[2].toDataURL("image/png", 1.0);
      const imgData4 = canvas[3].toDataURL("image/png", 1.0);


      var preHtml =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var postHtml = "</body></html>";
      // var html = preHtml + document.getElementById(element).innerHTML + postHtml;
      var html = preHtml 
      + "<h2>Projects in progress and completed</h2>"
      + "<img src='" + imgData + "' width='600' height='600'/>" 
      + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>" 
      + "<h2>Days left to completion</h2>"
      + "<img src='" + imgData2 + "' width='600' height='600'/>" 
      + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>" 
      + "<h2>Days left to completion</h2>"
      + "<img src='" + imgData3 + "' width='600' height='600'/>" 
      + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>" 
      + "<h2>Days left to completion</h2>"
      + "<img src='" + imgData4 + "' width='600' height='600'/>" 
      + "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>" 
      + "<h2>Number of projects in budget range</h2>"
      + "<img src='" + tableImgData + "' width='600'/>" 
      + postHtml;

      var blob = new Blob(["\ufeff", html], {
        type: "application/msword",
      });

      // Specify link url
      var url =
        "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

      // Specify file name
      filename = filename ? filename + ".doc" : "document.doc";

      // Create download link element
      var downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
      }

      document.body.removeChild(downloadLink);
    });
  };

  return (
    <StdButton onClick={() => generateDocx("pdffile", "word.docx")}>
      Generate DOCX
    </StdButton>
  );
};

// export const CreatePDFButton2 = (props) => {
//   const exportPDF = () => {
//     const canvas = document.getElementsByTagName("canvas");
//     const projecttable = document.getElementById("projecttable");

//     // Use html2canvas to generate a canvas element from the table
//     html2canvas(projecttable).then((tableCanvas) => {
//       const tableImgData = tableCanvas.toDataURL("image/png", 1.0);

//       const imgData = canvas[0].toDataURL("image/png", 1.0);
//       const imgData2 = canvas[1].toDataURL("image/png", 1.0);
//       const imgData3 = canvas[2].toDataURL("image/png", 1.0);
//       const imgData4 = canvas[3].toDataURL("image/png", 1.0);

//       let pdf = new JsPDF("p", "pt", "a4");
//       pdf.addImage(imgData, "PNG", 20, 30, 250, 250);
//       pdf.addImage(imgData2, "PNG", 320, 30, 250, 250);
//       pdf.addImage(imgData3, "PNG", 20, 280, 250, 250);
//       pdf.addImage(imgData4, "PNG", 320, 280, 250, 250);
//       // pdf.addImage(tableImgData2, "PNG", 20, 560, 500, 500);
//       // pdf.addImage(tableImgData, "PNG", 20, 560, 600, 100);

//       pdf.save("Default.pdf");
//     });
//   };

//   return <StdButton onClick={() => exportPDF()}>Generate PDF</StdButton>;
// };
export const CreatePDFButton2 = (props) => {
  const exportPDF = () => {
    const budgettable = document.getElementById("pdffile");

    // Use html2canvas to generate a canvas element from the table
    html2canvas(budgettable).then((tableCanvas) => {
      const tableImgData = tableCanvas.toDataURL("image/png", 1.0);

      let pdf = new JsPDF("p", "pt", "a4");

      pdf.addImage(tableImgData, "PNG", 0, 0, 595, 842);

      pdf.save("Default.pdf");
    });
  };

  return <StdButton onClick={() => exportPDF()}>Generate PDF</StdButton>;
};

const ProjectTable = (props) => {
  const data = props.data;
  // console.log(data);
  const deleteFn = props.delete;
  const navigate = useNavigate();

  const routeChange = (id) => {
    let path = `/Project/Edit/${id}`;
    navigate(path);
  };

  const params = useParams();
  const id = params.id;
  console.log(id);
  const [timeline, setTimeline] = useState([]);
  const [budget, setBudget] = useState();
  useEffect(() => {
    const getTimelineData = async () => {
      const res = await axios.get(`https://localhost:5001/api/Timeline/All`);
      console.log(res.data.data);
      let timelineItem = res.data.data.find(
        (timeline) => timeline.TimelineId == data.TimelineId
      );
      setTimeline(timelineItem);
    };
    const getBudgetData = async () => {
      const res = await axios.get(`https://localhost:5001/api/Budget/All`);
      console.log(res.data.data);
      let budgetItem = res.data.data.find(
        (budget) => budget.BudgetId == data.BudgetId
      );
      console.log(budgetItem);
      setBudget(budgetItem);
    };
    getBudgetData();
    getTimelineData();
  }, []);
  const handlePin = async (data) => {
    console.log(data);
    const res = await axios
      .put(`https://localhost:5001/api/Project/${data.ProjectId}`, {
        ...data,
        ProjectViewStatus: "Pinned",
      })
      .then(window.location.reload());
    console.log(res);
  };

  const handleUnpin = async (data) => {
    console.log(data);
    const res = await axios
      .put(`https://localhost:5001/api/Project/${data.ProjectId}`, {
        ...data,
        ProjectViewStatus: "None",
      })
      .then(window.location.reload());
    console.log(res);
  };
  const handleArchive = async (data) => {
    console.log(data);
    const res = await axios
      .put(`https://localhost:5001/api/Project/${data.ProjectId}`, {
        ...data,
        ProjectViewStatus: "Archived",
      })
      .then(window.location.reload());
    console.log(res);
  };
  console.log(budget);
  return (
    <>
    <div id="projecttable">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th colSpan={2}>Project Description</th>
            <th>Project Budget</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Completion Date</th>
            <th>Project Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>{data.ProjectName}</td>
            <td colSpan={2}>{data.ProjectDescription || "N/A"}</td>
            <td>{budget?.ProjectBudget || "N/A"}</td>
            <td>{timeline?.ProjectStartDate || "N/A"}</td>
            <td>{timeline?.ProjectEndDate || "N/A"}</td>
            <td>{timeline?.ProjectCompletionDate || "N/A"}</td>
            <td>{data.ProjectStatus}</td>
            <td>
              <button
                onClick={() => {
                  deleteFn(data.ProjectId);
                }}
              >
                Delete
              </button>
              <button onClick={() => routeChange(data.ProjectId)}>Edit</button>
              <button
                onClick={() => {
                  if (data.ProjectViewStatus === "Pinned") {
                    handleUnpin(data);
                  } else {
                    handlePin(data);
                  }
                }}
              >
                Pin
              </button>
              <button
                onClick={() => {
                  if (data.ProjectViewStatus === "Archived") {
                    handleUnpin(data);
                  } else {
                    handleArchive(data);
                  }
                }}
              >
                Archive
              </button>
            </td>
          </tr>
        </tbody>
      </Table>
      </div>
      <h1>Project Analysis</h1>
      <GenerateChart data={data} timeline={timeline} budget={budget} />
    </>
  );
};
function TableButton(props) {
  // Please Note replace projectType variable to new varibal that
  //for the volunteer List and it should be String
  const [showTable, setShowTable] = useState(false);

  function handleClick() {
    setShowTable(!showTable);
  }
  const [checked, setChecked] = useState(false);

  return (
    <div>
      <Button onClick={handleClick} variant="primary">
        Show Available Volunteers
      </Button>{" "}
      {!showTable && (
        <Table striped bordered hover style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          {props?.volunteerData.map((item) => {
            console.log(
              "check=>",
              props?.data.ProjectVolunteer?.includes(item?.UserId)
            );
            return (
              <>
                {props?.data.ProjectVolunteer?.includes(item?.UserId) ? null : (
                  <tbody>
                    <tr>
                      <td>{item?.UserId || "N/A"}</td>
                      <td>{item?.username || "N/A"}</td>
                      <td>{item?.Email || "N/A"}</td>
                      <td>{item?.Role || "N/A"}</td>
                      <td
                        style={{
                          textAlign: "center",
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        {/* <ToggleButton
                     className="mb-2"
                     style={{ margin: "auto" }}
                     id="toggle-check"
                     type="checkbox"
                     variant="outline-primary"
                     checked={checked}
                     disabled={props?.data?.ProjectType?.includes(
                       item?.UserId
                     )}
                     onChange={(e) => {
                       setChecked(e.currentTarget.checked);
                     }}
                   >
                     Select
                   </ToggleButton> */}

                        <Button
                          onClick={() => {
                            if (
                              !JSON.stringify(
                                props?.volunteerList || []
                              )?.includes(item?.UserId)
                            ) {
                              props?.setVolunteerList(item, true);
                            } else {
                              props?.setVolunteerList(item, false);
                            }
                          }}
                        >
                          {!JSON.stringify(
                            props?.volunteerList || []
                          )?.includes(item?.UserId)
                            ? "select"
                            : "Unselect"}
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                )}
              </>
            );
          })}
          :
        </Table>
      )}
    </div>
  );
}
function VolunteerTable(props) {
  console.log(props);
  return (
    <>
      <h1 style={{ marginTop: "50px" }}>Current Volunteers</h1>
      <div>
        <Table striped bordered hover style={{ marginTop: "30px" }}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          {JSON.parse(props?.data.ProjectVolunteer || "[]")?.length > 0 ? (
            JSON.parse(props?.data.ProjectVolunteer || "[]").map((item) => {
              console.log(item);
              return (
                <>
                  <tbody>
                    <tr>
                      <td>{item?.UserId || "N/A"}</td>
                      <td>{item?.username || "N/A"}</td>
                      <td>{item?.Email || "N/A"}</td>
                      <td>{item?.Role || "N/A"}</td>

                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            props?.deleteVolunteer(item);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </>
              );
            })
          ) : (
            <div style={{ textAlign: "center" }}>
              <h1>No volunteers allocated to this project!</h1>
            </div>
          )}
        </Table>
      </div>
    </>
  );
}

function GenerateChart(props) {
  const item = props.data;
  const timeline = props.timeline;
  const budget = props.budget;
  const getChartData1 = (startDate, endDate, budget) => {
    const startMonth = new Date(startDate).getMonth();
    const endMonth = new Date(endDate).getMonth();
    const labels = [];

    if (endMonth - startMonth < 2) {
      const startMonthName = new Date(startDate).toLocaleString("default", {
        month: "short",
      });
      const endMonthName = new Date(endDate).toLocaleString("default", {
        month: "short",
      });
      labels.push(startMonthName, endMonthName);
    } else {
      for (let i = startMonth; i <= endMonth; i++) {
        labels.push(
          new Date(2023, i, 1).toLocaleString("default", { month: "short" })
        );
      }
    }

    const totalMonths = labels.length;
    const data = [];
    let remainingBudget = budget;
    for (let i = 0; i < totalMonths; i++) {
      let estimatedBudget;

      if (totalMonths === 1) {
        estimatedBudget = budget;
      } else if (totalMonths === 2) {
        estimatedBudget = budget / 2;
      } else if (i === 0 || i === totalMonths - 1) {
        estimatedBudget = remainingBudget / 3;
      } else {
        const factor = Math.abs(i - (totalMonths - 1) / 2);
        estimatedBudget =
          (remainingBudget * (factor + 1)) /
          ((totalMonths * (totalMonths + 1)) / 4);
      }

      estimatedBudget = Math.round(estimatedBudget * 100) / 100;

      data.push(estimatedBudget);
      remainingBudget -= estimatedBudget;
    }

    return {
      labels,
      datasets: [
        {
          label: "Estimated Budget",
          data,
          backgroundColor: "#a6192e",
          borderColor: "#a6192e",
          borderWidth: 1,
        },
      ],
      plugins: [
        {
          id: "whiteBackground",
          beforeDraw: (chartInstance) => {
            const ctx = chartInstance.canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(
              0,
              0,
              chartInstance.canvas.width,
              chartInstance.canvas.height
            );
          },
        },
      ],
    };
  };

  const getChartData2 = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    const labels = [];
    const data = [];

    let currentDate = start;
    while (currentDate <= end) {
      const formattedDate = currentDate.toLocaleString("en-US", {
        month: "short",
      });
      labels.push(formattedDate);

      if (currentDate <= today) {
        data.push(
          daysLeft - Math.ceil((today - currentDate) / (1000 * 60 * 60 * 24))
        );
      } else {
        data.push(
          daysLeft - Math.ceil((currentDate - today) / (1000 * 60 * 60 * 24))
        );
      }

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "daysleft",
          data: data,
          backgroundColor: "#94795d",
        },
      ],
      plugins: [
        {
          id: "whiteBackground",
          beforeDraw: (chartInstance) => {
            const ctx = chartInstance.canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(
              0,
              0,
              chartInstance.canvas.width,
              chartInstance.canvas.height
            );
          },
        },
      ],
    };
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <div style={{ width: 800, height: 400, overflow: "auto" }}>
        {console.log(item, budget, timeline)}
        <Bar
          data={getChartData1(
            timeline?.ProjectStartDate,
            timeline?.ProjectEndDate,
            budget?.ProjectBudget
          )}
        />
      </div>
      <div style={{ width: 800, height: 400, overflow: "auto" }}>
        <Line
          data={getChartData2(
            timeline?.ProjectStartDate,
            timeline?.ProjectEndDate
          )}
        />
      </div>
    </div>
  );
}
