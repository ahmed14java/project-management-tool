import React, { Component } from "react";
import { Link } from "react-router-dom";
import Backlog from "./Backlog";
import { getBacklog } from "../../actions/backlogActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ProjectBoard extends Component {
  // constructor to handle errors
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBacklog(id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { id } = this.props.match.params;
    const { project_tasks } = this.props.backlog;
    const { errors } = this.state;

    let BroadContent;

    const boardAlgorithm = (errors, project_tasks) => {
      if (project_tasks.length < 1) {
        if (errors.projectNotFound) {
          return (
            <div className="alert alert-danger text-center">
              {errors.projectNotFound}
            </div>
          );
        }else if (errors.projectIdentifier) {
          return (
            <div className="alert alert-danger text-center">
              {errors.projectIdentifier}
            </div>
          );
        } else {
          return (
            <div className="alert alert-info text-center">
              No Project Tasks on this board
            </div>
          );
        }
      } else {
        return <Backlog project_tasks_prop={project_tasks} />
      }
    };

    BroadContent = boardAlgorithm(errors , project_tasks);

    return (
      <div className="container">
        <Link to={`/add-project-task/${id}`} className="btn btn-primary mb-3">
          <i className="fas fa-plus-circle">Create Project Task</i>
        </Link>
        <br />
        <hr />
        {BroadContent}
      </div>
    );
  }
}

ProjectBoard.propTypes = {
  backlog: PropTypes.object.isRequired,
  getBacklog: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  backlog: state.backlog,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBacklog }
)(ProjectBoard);
