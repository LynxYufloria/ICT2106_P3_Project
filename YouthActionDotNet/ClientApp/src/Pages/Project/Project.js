import React from "react";
import { useState, useEffect, useRef } from "react";
import { Loading } from "../../Components/appCommon";
import DatapageLayout from "../PageLayoutEmpty";
import handleSearchCallBack from "../PageLayoutEmpty";
import Table from "react-bootstrap/Table";
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import JsPDF from "jspdf";
import { StdButton } from "../../Components/common";
import {
  Cell,
  ListTable,
  HeaderRow,
  ExpandableRow,
} from "../../Components/tableComponents";
import { FaFileWord } from "react-icons/fa";
import { FaFileCsv } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { Pie, Bar, Line } from "react-chartjs-2";

import { saveAs } from "file-saver";
import { Document, Packer, Paragraph } from "docx";
import html2canvas from "html2canvas";

import { Button } from 'react-bootstrap';

export default class Project extends React.Component {
  // state = {
  //   content: null,
  //   headers: [],
  //   loading: true,
  //   settings: {},
  //   error: "",
  // };

  state = {
    content: null,
    pinned: null,
    archived: null,
    timeline: null,
    budget: null,
    headers: [],
    loading: true,
    settings: {},
    settingsTimeline: {},
    error: "",
    allContent: null,
  };

  settings = {
    title: "Project",
    primaryColor: "#a6192e",
    accentColor: "#94795d",
    textColor: "#ffffff",
    textColorInvert: "#606060",
    api: "/api/Project/",
  };
  settingsTimeline = {
    title: "Timeline",
    primaryColor: "#a6192e",
    accentColor: "#94795d",
    textColor: "#ffffff",
    textColorInvert: "#606060",
    api: "/api/Timeline/",
  };

  has = {
    Create: true,
    Generate: false,
    Delete: false,
  };

  async componentDidMount() {
    //-------------------------------------------TO BE UPDATED---------------------------------------//
    // window.addEventListener("storage",function(e) {
    //   // setSearchValue(localStorage.getItem("tag-value"))
    //   console.log("DISPLAYTABLE"+localStorage.getItem("tag-value"))
    // })
    await this.getAllContent().then((allContent) => {
      console.log("here");
      console.log(allContent);
      this.setState({
        allContent: allContent,
      });
    });
    await this.getPinned().then((pinned) => {
      console.log(pinned);
      this.setState({
        pinned: pinned,
      });
    });
    await this.getArchived().then((archived) => {
      console.log(archived);
      this.setState({
        archived: archived,
      });
    });
    await this.getTimeline().then((data) => {
      console.log(data);
      this.setState({
        timeline: data,
      });
    });
    await this.getBudget().then((data) => {
      console.log(data);
      this.setState({
        budget: data,
      });
    });
    //-------------------------------------------TO BE UPDATED---------------------------------------//

    await this.getContent().then((content) => {
      console.log(content);
      this.setState({
        content: content,
      });
    });

    await this.getSettings().then((settings) => {
      console.log(settings);
      this.setState({
        settings: settings,
      });
    });
    await this.getSettingsTimeline().then((settings) => {
      console.log(settings);
      this.setState({
        settingsTimeline: settings,
      });
    });

    this.setState({
      loading: false,
    });
    //-------------------------------------------TO BE UPDATED---------------------------------------//
    const perms = await this.props.permissions.find(
      (p) => p.Module === "Project"
    );
    const reformattedPerms = [];
    Object.keys(perms).forEach((perm) => {
      return perm === "Module"
        ? null
        : perms[perm] === true
          ? reformattedPerms.push(perm)
          : null;
    });

    this.setState({
      data: this.props.data,
      perms: perms,
    });
    //-------------------------------------------TO BE UPDATED---------------------------------------//
  }
  //-------------------------------------------TO BE UPDATED---------------------------------------//
  getAllContent = async () => {
    return fetch(this.settings.api + "All", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };
  // getContent = async () => {
  //   return fetch(this.settings.api + "GetProjectInProgress", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }).then((res) => {
  //     console.log(res);
  //     //Res = {success: true, message: "Success", data: Array(3)}
  //     return res.json();
  //   });
  // };
  getPinned = async () => {
    return fetch(this.settings.api + "GetProjectPinned", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };

  getArchived = async () => {
    return fetch(this.settings.api + "GetProjectArchived", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };
  getTimeline = async () => {
    return fetch(this.settings.api + "Timeline", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };
  getBudget = async () => {
    return fetch(this.settings.api + "Budget", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };

  //-------------------------------------------TO BE UPDATED---------------------------------------//

  //------------------------------------------------TO BE UPDATED---------------------------------------//
  //pin
  updateStatusToPinned = async (data) => {
    console.log(data);
    return fetch(this.settings.api + "UpdateStatusToPinned/" + data.ProjectId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      return res.json();
    });
  };
  //pin
  handleUpdateStatusToPinned = async (data) => {
    console.log("Data: " + data);
    await this.updateStatusToPinned(data).then((content) => {
      if (content.success) {
        console.log("Pin success");
        this.setState({
          error: "",
        });
        return true;
      } else {
        console.log("Pin fail");
        this.setState({
          error: content.message,
        });
        return false;
      }
    });
  };

  //archive
  updateStatusToArchive = async (data) => {
    console.log(data);
    return fetch(
      this.settings.api + "UpdateStatusToArchive/" + data.ProjectId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then(async (res) => {
      return res.json();
    });
  };

  //archive
  handleUpdateStatusToArchive = async (data) => {
    console.log("Data: " + data);
    await this.updateStatusToArchive(data).then((content) => {
      if (content.success) {
        console.log("Archive success");
        this.setState({
          error: "",
        });
        return true;
      } else {
        console.log("Archive fail");
        this.setState({
          error: content.message,
        });
        return false;
      }
    });
  };

  //update to in progress
  updateStatusToInProgress = async (data) => {
    console.log(data);
    return fetch(
      this.settings.api + "UpdateStatusToInProgress/" + data.ProjectId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then(async (res) => {
      return res.json();
    });
  };

  //update to in progress
  handleUpdateStatusToInProgress = async (data) => {
    console.log("Data: " + data);
    await this.updateStatusToInProgress(data).then((content) => {
      if (content.success) {
        console.log("Unpin success");
        this.setState({
          error: "",
        });
        return true;
      } else {
        console.log("Unpin fail");
        this.setState({
          error: content.message,
        });
        return false;
      }
    });
  };

  requestPinned = async () => {
    this.setState({
      loading: true,
    });
    await this.getPinned().then((pinned) => {
      console.log(pinned);
      this.setState({
        pinned: pinned,
        loading: false,
      });
    });
  };
  requestArchived = async () => {
    this.setState({
      loading: true,
    });
    await this.getArchived().then((archived) => {
      console.log(archived);
      this.setState({
        archived: archived,
        loading: false,
      });
    });
  };

  createLog = async (data) => {
    return fetch("https://localhost:5001/api/Logs/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(function (res) {
      return res.json();
    });
  };

  updateLog = async (data) => {
    console.log(data);
    return fetch(`${this.settings.api}UpdateAndFetch/${data.logId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      return res.json();
    });
  };

  handleLogUpdate = async (data) => {
    await this.updateLog(data).then((content) => {
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
  //------------------------------------------------TO BE UPDATED---------------------------------------//

  //------------------------------------------------TO BE UPDATED---------------------------------------//
  getChartData1 = (startDate, endDate, budget) => {
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
    };
  };

  getChartData2 = (startDate, endDate) => {
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
    };
  };

  getChartData3 = (completed, inProgress) => {
    return {
      labels: ["Completed Project", "In Progress Projects"],
      datasets: [
        {
          label: "Projects",
          data: [completed - inProgress, inProgress],
          backgroundColor: ["#5463FF", "#FF1818"],
        },
      ],
    };
  };
  //------------------------------------------------TO BE UPDATED---------------------------------------//

  getSettings = async () => {
    // fetches http://...:5001/api/User/Settings
    return fetch(this.settings.api + "Settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      return res.json();
    });
  };
  getSettingsTimeline = async () => {
    // fetches http://...:5001/api/User/Settings
    return fetch(this.settingsTimeline.api + "Settings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
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
      console.log(res);
      //Res = {success: true, message: "Success", data: Array(3)}
      return res.json();
    });
  };

  update = async (data) => {
    console.log(data);
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
  create = async (data) => {
    return fetch("https://localhost:5001/api/Project/Create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(function (res) {
      return res.json();
    });
  };
  delete = async (data) => {
    await fetch(`https://localhost:5001/api/Project/Delete/${data}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      return res.json();
    });
  };

  handleUpdate = async (data) => {
    await this.update(data).then((content) => {
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
      console.log(content);
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
      console.log(this.state.settings);
      console.log(this.state.settings.data.ColumnSettings);
      console.log(this.state.settingsTimeline.data.ColumnSettings);
      console.log(this.state.archived.data);
      return (
        <>
          <DatapageLayout
            settings={this.settings}
            fieldSettings={this.state.settings.data.FieldSettings}
            headers={this.state.settings.data.ColumnSettings}
            data={this.state.content.data}
            updateHandle={this.handleUpdate}
            requestRefresh={this.requestRefresh}
            error={this.state.error}
            permissions={this.props.permissions}
            requestError={this.requestError}
            has={this.has}
          >
            <DisplayTables
              data={this.state.content.data}
              delete={this.delete}
              create={this.create}
            />

            {console.log(this.state.pinned.data)}
          </DatapageLayout>
        </>
      );
    }
  }
}

const DisplayTables = (props) => {
  const data = props.data;
  const deleteFn = props.delete;
  const createFn = props.create;
  const tagValue = tagValueConstant;
  //-------------------------------------------------------------------//

  function handleKeydown(e) {
    if (e.key === "Enter") {
      setSearchValue(localStorage.getItem("tag-value"));
    }
  }
  document.addEventListener("keydown", handleKeydown);
  //------------------------------------------------------------------//
  let navigate = useNavigate();
  const routeChange = (id) => {
    let path = `/Project/View/${id}`;
    navigate(path);
  };
  const routeReturn = () => {
    let path = `/Project`;
    navigate(path);
  };

  const countRef = useRef();
  const [projects, setProjects] = useState([]);
  const [archiveProjects, setArchiveProjects] = useState([]);
  const [pinnedProjects, setPinnedProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  //------------------------------------------------------------------------------//
  const [searchValue, setSearchValue] = useState("");
  //------------------------------------------------------------------------------//
  const [projRef, setProjRef] = useState();
  const [undo, setUndo] = useState(false);
  const [sorting, setSorting] = useState({
    field: "ProjectName",
    ascending: true,
  });
  const params = useParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
  } else {
    console.log("no params");
  }
  const options = {
    onClose: () => {
      console.log(countRef);
      if (countRef.current == null) {
        deleteFn(params.id);
      }
    },
    autoClose: 2000,
    hideProgressBar: true,
    className: "black-background",
    position: toast.POSITION.BOTTOM_CENTER,
  };
  //------------------------------------------------------------------------------//
  const filterArticles = (searchValue) => {
    if (searchValue === "") {
      return projects;
    }
    return projects.filter((project) =>
      project.ProjectName.toLowerCase().includes(searchValue.toLowerCase())
    );
  };
  useEffect(() => {
    const filteredArticles = filterArticles(searchValue);
    setOtherProjects(filteredArticles);
  }, [searchValue]);
  //------------------------------------------------------------------------------//

  //When delete is clicked, all details of the project will be copied and stored in temporary variable.
  useEffect(() => {
    // setProjects(data);
    const projectsCopy = [...data];
    const projectsFiltered = projectsCopy.filter((project) => {
      return project.ProjectId != params.id;
    });

    // Apply sorting
    let sortedProjects = [];
    if (undo == true) {
      sortedProjects = projectsCopy
        .sort((a, b) => {
          console.log(a[sorting.field]);
          console.log(b[sorting.field]);
          if (typeof b[sorting.field] == "string") {
            if (b) {
              return a ? b[sorting.field]?.localeCompare(a[sorting.field]) : 1;
            } else if (a) {
              return b ? a[sorting.field]?.localeCompare(b[sorting.field]) : -1;
            }
          } else if (typeof b[sorting.field] == "number") {
            if (b) {
              return a ? b[sorting.field] - a[sorting.field] : 1;
            } else if (a) {
              return b ? a[sorting.field] - b[sorting.field] : -1;
            }
          }
        })
        .slice();
    } else {
      setProjRef(
        projectsCopy.filter((project) => {
          return project.ProjectId == params.id;
        })
      );
      sortedProjects = projectsFiltered
        .sort((a, b) => {
          // console.log(a[sorting.field]);
          // console.log(typeof b[sorting.field]);
          if (typeof b[sorting.field] == "string") {
            if (b) {
              return a ? b[sorting.field]?.localeCompare(a[sorting.field]) : 1;
            } else if (a) {
              return b ? a[sorting.field]?.localeCompare(b[sorting.field]) : -1;
            }
          } else if (typeof b[sorting.field] == "number") {
            if (b) {
              return a ? b[sorting.field] - a[sorting.field] : 1;
            } else if (a) {
              return b ? a[sorting.field] - b[sorting.field] : -1;
            }
          }
        })
        .slice();
    }
    const projectsPinned = sortedProjects.filter((project) => {
      return project.ProjectViewStatus == "Pinned";
    });

    const projectsArchived = sortedProjects.filter((project) => {
      return project.ProjectViewStatus == "Archived";
    });

    const projectsOther = sortedProjects.filter((project) => {
      return (
        project.ProjectViewStatus == "None" || project.ProjectViewStatus == null
      );
    });
    // const projectsOther = sortedProjects.filter((project) => {
    //   return (project.ProjectViewStatus == "None" || project.ProjectViewStatus == null)&&project.ProjectName == tagValueConstant;
    // });
    // const projectsOther = sortedProjects.filter((project) => {
    //   console.log("refreshTable"+tagValueConstant)
    //   return project.ProjectName == tagValueConstant;
    // });

    // const searchProjects = sortedProjects.filter((project) => {
    //   return project.ProjectName == tagValue;
    // });

    setArchiveProjects(
      sorting.ascending ? projectsArchived : projectsArchived.reverse()
    );
    setPinnedProjects(
      sorting.ascending ? projectsPinned : projectsPinned.reverse()
    );
    setOtherProjects(
      sorting.ascending ? projectsOther : projectsOther.reverse()
    );
    setProjects(
      // Decide either currentprojects sorted by ascending or descending order
      sorting.ascending ? sortedProjects : sortedProjects.reverse()
    );
  }, [data, sorting, undo]);
  useEffect(() => {
    if (data.length > projects.length && projects.length != 0) {
      notify();
      //   console.log(data.length)
      // console.log(projects.length)
    }
  }, [projects]);
  //Toast Message is created to allow users to undo deletion of project
  const notify = () => {
    toast.info(undoToastBtn, options);
  };
  const undoToastBtn = () => (
    <button
      ref={countRef}
      onClick={() => {
        setUndo(true);
        const proj = {
          ProjectName: projRef[0].ProjectName,
          ProjectDescription: projRef[0].ProjectDescription,
          ProjectBudget: projRef[0].ProjectBudget,
          ProjectStartDate: projRef[0].ProjectStartDate,
          ProjectEndDate: projRef[0].ProjectEndDate,
          ProjectCompletionDate: projRef[0].ProjectCompletionDate,
          ProjectVolunteer: projRef[0].ProjectVolunteer,
          ProjectStatus: projRef[0].ProjectStatus,
          ProjectViewStatus: projRef[0].ProjectViewStatus,
          // ProjectType: projRef[0].ProjectType,
          ServiceCenterId: projRef[0].ServiceCenterId,
        };
        console.log(proj);
        handleCreate(proj);
        routeReturn();
      }}
    >
      Undo
    </button>
  );

  const handleCreate = async (proj) => await createFn(proj);

  function applySorting(key, ascending) {
    setSorting({ field: key, ascending: ascending });
  }

  console.log(projects);

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Pinned Projects</Accordion.Header>
          <Accordion.Body>
            <ProjectTable
              projects={pinnedProjects}
              applySorting={applySorting}
              routeChange={routeChange}
              sorting={sorting}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Current Projects</Accordion.Header>
          <Accordion.Body>
            <ProjectTable
              projects={otherProjects}
              applySorting={applySorting}
              routeChange={routeChange}
              sorting={sorting}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Archived Projects</Accordion.Header>
          <Accordion.Body>
            <ProjectTable
              projects={archiveProjects}
              applySorting={applySorting}
              routeChange={routeChange}
              sorting={sorting}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Charts</Accordion.Header>
          <Accordion.Body>
            <GenerateChart projects={projects} />

            <CreatePDFButton />
            <br></br>
            <CreateDocxButton />
            <br></br>
            <StdButton>Generate XLS</StdButton>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Logging</Accordion.Header>
          <Accordion.Body>
            <Logging />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};
let tagValueConstant = null;

export const GetTagValue = (props, callback) => {
  const tagValue = props.tagValue;
  // setSearchValue(tagValue)
  tagValueConstant = tagValue.substring(1, tagValue.length - 1);
  console.log("HAHAHHAHAHHAHHAHAHHA " + tagValueConstant);
  localStorage.setItem("tag-value", tagValueConstant);
};

const logsArr = [
  {
    id: 1,
    logProject: "love in action",
    logDescription: "Project budget = 10000 to 6000",
    logAction: "Update",
    logDoneByUser: "test",
    logDate: "30/03/2023 02:18",
  },
  {
    id: 2,
    logProject: "Project Youth",
    logDescription: "Project Description = Help young teenager in need",
    logAction: "Update",
    logDoneByUser: "test",
    logDate: "30/03/2023 01:10",
  },
];

const Logging = () => {
  const [logs, setLogs] = useState(logsArr);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("logs"));
    if (storedLogs) {
      setLogs(storedLogs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const handleDeleteLog = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Log Project</th>
            <th>Log User</th>
            <th>Log Action</th>
            <th>Log Description</th>
            <th>Log Date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
              <td>{log.logProject}</td>
              <td>{log.logDoneByUser}</td>
              <td>{log.logAction}</td>
              <td>{log.logDescription}</td>
              <td>{log.logDate}</td>
              <td>
                <button
                  onClick={() => handleDeleteLog(log.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export const ProjectTable = (props) => {
  const projects = props.projects;
  const applySorting = props.applySorting;
  const routeChange = props.routeChange;
  const sorting = props.sorting;
  const [timelines, setTimeline] = useState([]);
  const [budgets, setBudget] = useState([]);
  const logs = props.logs;
  useEffect(() => {
    const getTimelineData = async () => {
      const res = await axios.get(`https://localhost:5001/api/Timeline/All`);
      console.log(res.data.data);
      setTimeline(res.data.data);
    };
    const getBudgetData = async () => {
      const res = await axios.get(`https://localhost:5001/api/Budget/All`);
      console.log(res.data.data);
      setBudget(res.data.data);
    };
    getBudgetData();
    getTimelineData();
  }, []);
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th onClick={() => applySorting("ProjectName", !sorting.ascending)}>
              Project Name
            </th>
            <th
              style={{ cursor: "pointer" }}
              colSpan={2}
              onClick={() => {
                console.log(sorting);
                return applySorting("ProjectDescription", !sorting.ascending);
              }}
            >
              Project Description
            </th>
            {/* <th
              onClick={() =>
                applySorting("ProjectVolunteer", !sorting.ascending)
              }
            >
              Project Type
            </th> */}
            <th
              style={{ cursor: "pointer" }}
              onClick={() => applySorting("ProjectBudget", !sorting.ascending)}
            >
              Project Budget
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() =>
                applySorting("ProjectStartDate", !sorting.ascending)
              }
            >
              Start Date
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => applySorting("ProjectEndDate", !sorting.ascending)}
            >
              End Date
            </th>
            <th
              style={{ cursor: "pointer" }}
              onClick={() => applySorting("ProjectStatus", !sorting.ascending)}
            >
              Project Status
            </th>
            <th>Action</th>
          </tr>
        </thead>
        {projects.map((item, key) => {
          let budgetItem = budgets.find(
            (budget) => budget.BudgetId == item.BudgetId
          );
          let timelineItem = timelines.find(
            (timeline) => timeline.TimelineId == item.TimelineId
          );
          // console.log(timelineItem);
          // console.log(budgetItem);
          return (
            <tbody key={key}>
              <tr>
                <td>{key + 1}</td>
                <td>{item.ProjectName}</td>
                <td colSpan={2}>
                  <>
                    {item.ProjectDescription}
                    {/* {JSON.parse(item.ProjectVolunteer || "[]")?.length > 0 ? (
                      <div className="mt-2">
                        <b>Volunteers: </b>
                        {JSON.parse(item.ProjectVolunteer || "[]")?.map((item) => (
                          <span>
                            {item?.username} <span></span>
                          </span>
                        )) || "N/A"}
                      </div>
                    ) : null} */}
                  </>
                </td>
                {/* <td>{item.ProjectVolunteer}</td> */}
                <td>
                  {budgetItem?.ProjectBudget ? budgetItem.ProjectBudget : "N/A"}
                </td>
                <td>
                  {timelineItem?.ProjectStartDate
                    ? timelineItem.ProjectStartDate
                    : "N/A"}
                </td>
                <td>
                  {timelineItem?.ProjectEndDate
                    ? timelineItem.ProjectEndDate
                    : "N/A"}
                </td>
                <td>{item.ProjectStatus}</td>
                <td>
                  <button onClick={() => routeChange(item.ProjectId)}>
                    View
                  </button>

                  {/* <button onClick={() => setUndo(true)}>Undo</button> */}
                </td>
              </tr>
            </tbody>
          );
        })},
      </Table>
      <ToastContainer theme="dark" />
    </>
  );
};

export const BudgetTable = (props) => {
  const budgetRanges = [
    { min: 0, max: 10, label: "< $1000" },
    { min: 10, max: 50, label: "$1000-$5000" },
    { min: 50, max: 100, label: "$5000-$10000" },
    { min: 100, max: Infinity, label: "> $10000" },
  ];

  const budgetData = [
    { range: "< $1000", count: 1 },
    { range: "$1000-$5000", count: 2 },
    { range: "$5000-$10000", count: 3 },
    { range: "> $10000", count: 2 },
  ];

  return (
    <>
      <div id="budgettable">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Budget Range</th>
              <th>Project Count</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{item.range}</td>
                  <td>{item.count}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <ToastContainer theme="dark" />
      </div>
    </>
  );
};

const GenerateChart = (props) => {
  const projects = props.projects;
  const [timelines, setTimeline] = useState([]);
  const [budgets, setBudget] = useState([]);
  useEffect(() => {
    const getTimelineData = async () => {
      const res = await axios.get(`https://localhost:5001/api/Timeline/All`);
      console.log(res.data.data);
      setTimeline(res.data.data);
    };
    const getBudgetData = async () => {
      const res = await axios.get(`https://localhost:5001/api/Budget/All`);
      console.log(res.data.data);
      setBudget(res.data.data);
    };
    getBudgetData();
    getTimelineData();
  }, []);

  const getChartData3 = (projects) => {
    const inProgress = projects.filter((project) => {
      return project.ProjectStatus === "In progress";
    }).length;
    const completed = projects.filter((project) => {
      return project.ProjectStatus === "Completed";
    }).length;
    console.log(completed);
    return {
      labels: ["In Progress Projects", "Completed Project"],
      datasets: [
        {
          label: "Projects",
          data: [inProgress, completed],
          backgroundColor: ["#FF1818", "#5463FF"],
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

  const pieChartOptions = {
    backgroundColor: "white",
    maintainAspectRatio: false,
    legend: {
      position: "bottom",
    },
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold",
        },
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
    scales: {
      x: {
        backgroundColor: "transparent",
      },
      y: {
        backgroundColor: "transparent",
      },
    },
  };

  const getChartData4 = (projects, timelines) => {
    const now = new Date();
    const inProgress = projects.filter((project) => {
      return project.ProjectStatus === "In progress";
    });
    const data = inProgress.map((project) => {
      const timeline = timelines.find(
        (timeline) => timeline.TimelineId == project.TimelineId
      );
      console.log(timeline);
      const endDate = new Date(timeline?.ProjectEndDate);
      const diffInDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)); // difference in days between now and end date
      return diffInDays < 0 ? 0 : diffInDays;
    });
    const labels = inProgress.map((project) => project.ProjectName);

    return {
      labels: labels,
      datasets: [
        {
          label: "Days left",
          data: data,
          backgroundColor: ["#5463FF"],
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

  const barChartOptions = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          backgroundColor: "transparent",
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          backgroundColor: "transparent",
        },
      ],
    },
  };
  return (
    <div>
      <div
        id="pdffile"
        style={
          {
            // backgroundImage:
            //   "url('https://www.solidbackgrounds.com/images/2560x1440/2560x1440-white-solid-color-background.jpg')",
            // backgroundColor: "white",
          }
        }
      >
        <section className="report-dashboard">
          <div className="row">
            <div className="flex-container" style={{ textAlign: "center" }}>
              <div className="report-dashboard-item">
                <div
                  style={{
                    width: 600,
                    height: 600,
                    overflow: "auto",
                    margin: "auto",
                    display: "inline-block",
                  }}
                >
                  <Pie
                    data={getChartData3(projects)}
                    options={pieChartOptions}
                  />
                </div>
                <div
                  style={{
                    width: 600,
                    height: 600,
                    overflow: "auto",
                    margin: "auto",
                    display: "inline-block",
                  }}
                >
                  <Bar
                    data={getChartData4(projects, timelines)}
                    options={barChartOptions}
                  />
                </div>
                <BudgetTable />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const CreateDocxButton = (props) => {
  const generateDocx = (element, filename = "") => {
    const canvas = document.getElementsByTagName("canvas");

    const budgettable = document.getElementById("budgettable");
    // Use html2canvas to generate a canvas element from the table
    html2canvas(budgettable).then((tableCanvas) => {
      const tableImgData = tableCanvas.toDataURL("image/png", 1.0);

      const imgData = canvas[0].toDataURL("image/png", 1.0);
      const imgData2 = canvas[1].toDataURL("image/png", 1.0);


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

export const CreatePDFButton = (props) => {
  const exportPDF = () => {
    const canvas = document.getElementsByTagName("canvas");

    const budgettable = document.getElementById("budgettable");

    // Use html2canvas to generate a canvas element from the table
    html2canvas(budgettable).then((tableCanvas) => {
      const tableImgData = tableCanvas.toDataURL("image/png", 1.0);

      const imgData = canvas[0].toDataURL("image/png", 1.0);
      const imgData2 = canvas[1].toDataURL("image/png", 1.0);

      let pdf = new JsPDF("p", "pt", "a4");
      pdf.addImage(imgData, "PNG", 20, 30, 250, 250);
      pdf.addImage(imgData2, "PNG", 320, 30, 250, 250);
      pdf.addImage(tableImgData, "PNG", 0, 350, 600, 150);

      pdf.save("Default.pdf");
    });
  };

  return <StdButton onClick={() => exportPDF()}>Generate PDF</StdButton>;
};

class ViewManagement extends React.Component {
  state = {
    drawerOpen: false,
    expanded: false,
    showBottomMenu: false,
    expansionContent: "",
    expansionComponent: "",
    popUpContent: "",
    data: this.props.data,
    itemsPerPage: 20,
    currentPage: 1,
    pageNumbers: [],
  };

  componentDidMount() {
    // let columns = [];
    // for(var i = 0; i < Object.keys(this.props.fieldSettings).length; i++){
    //     columns.push(
    //         {
    //             label: Object.keys(this.props.fieldSettings)[i],
    //             key: Object.keys(this.props.fieldSettings)[i],
    //         }
    //     );
    // }
    // this.setState({
    //     columns: columns
    // });
  }
  render() {
    if (this.state.content === "") {
      return <div></div>;
    }
    const indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.state.itemsPerPage;
    const currentItems = this.state.data.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    console.log("First and last: " + indexOfFirstItem + indexOfLastItem);
    return (
      <div>
        <div className="d-flex justify-content-center align-items-start flex-fill">
          <ListTable settings={this.settings}>
            <HeaderRow>
              {Object.keys(this.props.headers).map((key, index) => {
                console.log(key, index);
                console.log(this.props.headers[key].displayHeader);
                return (
                  <Cell width={"100%"} key={index}>
                    {this.props.headers[key].displayHeader}
                  </Cell>
                );
              })}
            </HeaderRow>
            {this.state.data &&
              currentItems.map((row, index) => {
                return (
                  <ExpandableRow
                    updateHandle={this.props.updateHandle}
                    values={row}
                    fieldSettings={this.props.fieldSettings}
                    key={index}
                    settings={this.settings}
                    headers={this.props.headers}
                    setExpansionContent={this.setExpansionContent}
                    handleSeeMore={this.handleSeeMore}
                    handleClose={this.handleClose}
                    popUpContent={this.state.popUpContent}
                    perms={this.state.perms}
                  >
                    <br></br>
                    <button color="red">Unpin Project</button>
                    <br></br>
                    <br></br>Export to:
                    <FaFileWord size={30} />
                    <FaFilePdf size={30} />
                    <FaFileCsv size={30} />
                    {this.props.children
                      ? this.props.children[
                      index +
                      (this.state.currentPage - 1) *
                      this.state.itemsPerPage
                      ]
                      : ""}
                  </ExpandableRow>
                );
              })}
          </ListTable>
        </div>
      </div>
    );
  }
}
