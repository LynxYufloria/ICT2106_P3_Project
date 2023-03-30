import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { Loading } from "../../Components/appCommon";
import DatapageLayout from "../PageLayoutEmpty";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router";
import ToggleButton from "react-bootstrap/ToggleButton";
import { Overlay } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from "axios";

export default class Edit extends React.Component {
  state = {
    content: null,
    headers: [],
    loading: true,
    settings: {},
    volunteer: [],
    selectedVolunteer: [],
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
      console.log("Edit -> componentDidMount -> volunteer", volunteer);
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

  //UPDATE TIMELINE
  updateTimeline = async (data) => {
    // console.log("===;[;[;[", data);
    return fetch(
      `https://localhost:5001/api/Timeline/Update/${data.TimelineId}`,
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

    const projectVolunteers = JSON.parse(Project[0]?.ProjectType || "[]");

    const data = {
      ...Project[0],
      ProjectId: Project[0]?.ProjectId,
      ProjectType: JSON.stringify([
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
      Project[0]?.ProjectType || "[]"
    ).filter((item) => item?.UserId !== vol?.UserId);
    const data = {
      ...Project[0],
      ProjectId: Project[0]?.ProjectId,
      ProjectType: JSON.stringify(filteredVolunteers),
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
          <ProjectTable
            data={data[0]}
            delete={this.delete}
            update={this.update}
            volunteerData={this.state.volunteer}
            setVolunteerList={this.setVolunteerList}
            deleteVolunteer={this.deleteVolunteer}
            volunteerList={this.state.selectedVolunteer}
            // handleSubmit={handleSubmit}
          />
          <div>
            {/* <TableButton
              volunteerData={this.state.volunteer}
              setVolunteerList={this.setVolunteerList}
              deleteVolunteer={this.deleteVolunteer}
              data={data[0]}
              volunteerList={this.state.selectedVolunteer}
            /> */}
          </div>
          {/* <Button onClick={() => this.setVolunteer()}>Submit</Button> */}
        </DatapageLayout>
      );
    }
  }
}
const ProjectTable = (props) => {
  //   const data = props.data;
  // console.log(data);
  const updateFn = props.update;
  const deleteFn = props.delete;
  //   const handleSubmit = props.handleSubmit;
  const params = useParams();
  const id = params.id;

  console.log(params);
  const [allContent, setContent] = useState();
  const [project, setProject] = useState({
    ProjectId: "",
    ProjectName: "",
    ProjectDescription: "",
    // ProjectType: "",
    TimelineId: "",
    ProjectStatus: "",
    ProjectStartDate: "",
    ProjectEndDate: "",
    ProjectCompletionDate: "",
    ProjectBudget: "",
  });
  const [timeline, setTimeline] = useState();
  const [budget, setBudget] = useState();
  useEffect(() => {
    const getData = async () => {
      const res = await axios.get("https://localhost:5001/api/Project/All");
      console.log(res.data.data);
      setContent(res.data.data);
    };
    getData();
  }, []);

  useEffect(() => {
    console.log(allContent);
    const data = allContent?.filter((item) => {
      return item.ProjectId == id;
    });
    if (data != undefined) {
      const getTimelineData = async () => {
        const res = await axios.get(
          `https://localhost:5001/api/Timeline/${data[0].TimelineId}`
        );
        console.log(res.data.data);
        setTimeline(res.data.data);
      };
      const getBudgetData = async () => {
        const res = await axios.get(
          `https://localhost:5001/api/Budget/${data[0].BudgetId}`
        );
        console.log(res.data.data);
        setBudget(res.data.data);
      };
      getBudgetData();
      getTimelineData();

      console.log(data);
      setProject({
        ...project,
        ProjectId: data[0].ProjectId,
        ProjectName: data[0].ProjectName,
        ProjectDescription: data[0].ProjectDescription,
        // ProjectType: data[0].ProjectType,
        TimelineId: data[0].TimelineId,
        ProjectViewStatus: data[0].ProjectViewStatus,
        ProjectStatus: data[0].ProjectStatus,
        BudgetId: data[0].BudgetId,
        ServiceCenterId: data[0].ServiceCenterId,
      });
    }
  }, [allContent]);

  // function to update project
  function updateProject(item) {
    axios
      .all([
        axios.put(`https://localhost:5001/api/Project/${item.ProjectId}`, {
          ...project,
          ProjectName: item.ProjectName,
          ProjectStatus: item.ProjectStatus,
        }),
        axios.put(`https://localhost:5001/api/Timeline/${item.TimelineId}`, {
          ...timeline,
          ProjectStartDate: item.ProjectStartDate,
          ProjectEndDate: item.ProjectEndDate,
          ProjectCompletionDate: item.ProjectCompletionDate,

          //   ProjectStatus: item.ProjectStatus,
        }),
        axios.put(`https://localhost:5001/api/Budget/${item.BudgetId}`, {
          ...budget,
          ProjectBudget: item.ProjectBudget,
        }),
      ])
      .then(
        axios.spread((data1, data2, data3) => {
          // output of req.
          console.log("Project", data1, "Timeline", data2, "Budget", data3);
        })
      );
  }

  // Please Note replace projectType variable to new varibal that
  //for the volunteer List and it should be String
  const [showTable, setShowTable] = useState(false);

  function handleClick() {
    setShowTable(!showTable);
  }
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log(project);
    project.ProjectStartDate = timeline.ProjectStartDate;
    project.ProjectEndDate = timeline.ProjectEndDate;
    project.ProjectCompletionDate = timeline.ProjectCompletionDate;
    console.log(budget.ProjectBudget);
    project.ProjectBudget = budget.ProjectBudget;

    // submit split into 3 parts, project, timeline, budget
    updateProject(project);
    // event.preventDefault();
  };
  const [checked, setChecked] = useState(false);

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridProjectName">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            placeholder="Enter Project Name"
            value={project?.ProjectName}
            onChange={(e) => {
              console.log(e.target.value);
              setProject({ ...project, ProjectName: e.target.value });
            }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridProjectStatus">
          <Form.Label>Project Status</Form.Label>
          <Form.Control
            placeholder="Enter Project Status"
            value={project?.ProjectStatus}
            onChange={(e) => {
              setProject({ ...project, ProjectStatus: e.target.value });
            }}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridProjectBudget">
          <Form.Label>Project Budget</Form.Label>
          <Form.Control
            placeholder="Enter Project Budget"
            value={budget?.ProjectBudget}
            type="number"
            onChange={(e) => {
              setBudget({ ...budget, ProjectBudget: e.target.value });
              setProject({ ...project, ProjectBudget: e.target.value });
            }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridProjectStartDate">
          <Form.Label>Project Start Date</Form.Label>
          <Form.Control
            type="date"
            value={
              timeline?.ProjectStartDate &&
              new Date(timeline?.ProjectStartDate).toISOString().split("T")[0]
            }
            onChange={(e) => {
              console.log(e.target.value);
              setTimeline({ ...timeline, ProjectStartDate: e.target.value });
              setProject({ ...project, ProjectStartDate: e.target.value });
            }}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridProjectEndDate">
          <Form.Label>Project End Date</Form.Label>
          <Form.Control
            type="date"
            value={
              timeline?.ProjectEndDate &&
              new Date(timeline?.ProjectEndDate).toISOString().split("T")[0]
            }
            onChange={(e) => {
              console.log(e.target.value);
              setTimeline({ ...timeline, ProjectEndDate: e.target.value });
              setProject({ ...project, ProjectEndDate: e.target.value });
            }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridProjectCompletion">
          <Form.Label>Project Completion</Form.Label>
          <Form.Control
            type="date"
            value={
              timeline?.ProjectCompletionDate &&
              new Date(timeline?.ProjectCompletionDate)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) => {
              console.log(e.target.value);
              setTimeline({
                ...timeline,
                ProjectCompletionDate: e.target.value,
              });
              setProject({
                ...project,
                ProjectCompletionDate: e.target.value,
              });
            }}
          />
        </Form.Group>
      </Row>
      {/* -------------------------------------------------------CHANGES MADE------------------------------------------------------ */}
      {/* <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridProjectViewStatus">
            <Form.Label>Project View Status</Form.Label>
            <Form.Control
              placeholder="Enter Project View Status"
              value={project?.ProjectViewStatus}
              onChange={(e) => {
                console.log(e.target.value);
                setProject({ ...project, ProjectViewStatus: e.target.value });
              }}
            />
          </Form.Group>
      </Row> */}
      {/* -------------------------------------------------------CHANGES MADE------------------------------------------------------ */}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
// function TableButton(props) {
//   // Please Note replace projectType variable to new varibal that
//   //for the volunteer List and it should be String
//   const [showTable, setShowTable] = useState(false);

//   function handleClick() {
//     setShowTable(!showTable);
//   }
//   const [checked, setChecked] = useState(false);

//   return (
//     <div>
//       <Button onClick={handleClick} variant="primary">
//         Show Available Volunteers
//       </Button>{" "}
//       {!showTable && (
//         <Table striped bordered hover style={{ marginTop: "20px" }}>
//           <thead>
//             <tr>
//               <th>User ID</th>
//               <th>User Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           {props?.volunteerData.map((item) => {
//             console.log(
//               "check=>",
//               props?.data.ProjectType?.includes(item?.UserId)
//             );
//             return (
//               <>
//                 {props?.data.ProjectType?.includes(item?.UserId) ? null : (
//                   <tbody>
//                     <tr>
//                       <td>{item?.UserId || "N/A"}</td>
//                       <td>{item?.username || "N/A"}</td>
//                       <td>{item?.Email || "N/A"}</td>
//                       <td>{item?.Role || "N/A"}</td>
//                       <td
//                         style={{
//                           textAlign: "center",
//                           width: "100px",
//                           height: "100px",
//                         }}
//                       >
//                         {/* <ToggleButton
//                      className="mb-2"
//                      style={{ margin: "auto" }}
//                      id="toggle-check"
//                      type="checkbox"
//                      variant="outline-primary"
//                      checked={checked}
//                      disabled={props?.data?.ProjectType?.includes(
//                        item?.UserId
//                      )}
//                      onChange={(e) => {
//                        setChecked(e.currentTarget.checked);
//                      }}
//                    >
//                      Select
//                    </ToggleButton> */}

//                         <Button
//                           onClick={() => {
//                             if (
//                               !JSON.stringify(
//                                 props?.volunteerList || []
//                               )?.includes(item?.UserId)
//                             ) {
//                               props?.setVolunteerList(item, true);
//                             } else {
//                               props?.setVolunteerList(item, false);
//                             }
//                           }}
//                         >
//                           {!JSON.stringify(
//                             props?.volunteerList || []
//                           )?.includes(item?.UserId)
//                             ? "select"
//                             : "Unselect"}
//                         </Button>
//                       </td>
//                     </tr>
//                   </tbody>
//                 )}
//               </>
//             );
//           })}
//           :
//         </Table>
//       )}
//     </div>
//   );
// }
