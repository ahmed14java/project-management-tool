import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import { getProjectTask , updateProjectTask } from '../../../actions/backlogActions';

class UpdateProjectTask extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'id': '',
      'projectSequence': '',
      'summary': '',
      'acceptanceCriteria': '',
      'status': '',
      'periority': 0,
      'dueDate': '',
      'projectIdentifier': '',
      'createdAt': '',
      errors: {}
    }
  }
  

  componentDidMount() {
    const {backlog_id , pt_id } = this.props.match.params;
    this.props.getProjectTask(backlog_id , pt_id , this.props.history);
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }
    const {
      id,
      projectSequence,
      summary,
      acceptanceCriteria,
      status,
      periority,
      dueDate,
      projectIdentifier,
      createdAt,
    } = nextProps.project_task;
    this.setState({
      id,
      projectSequence,
      summary,
      acceptanceCriteria,
      status,
      periority,
      dueDate,
      projectIdentifier,
      createdAt,
    })
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value})
  }
  
  onSubmit(e){
    e.preventDefault();
    const {
      id,
      projectSequence,
      summary,
      acceptanceCriteria,
      status,
      periority,
      dueDate,
      projectIdentifier,
      createdAt,
    } = this.state;
    const updateProjectTask = {
      'id': id,
      'projectSequence': projectSequence,
      'summary': summary,
      'acceptanceCriteria': acceptanceCriteria,
      'status': status,
      'periority': periority,
      'dueDate': dueDate,
      'projectIdentifier': projectIdentifier,
      'createdAt': createdAt
    };
    this.props.updateProjectTask(projectIdentifier , projectSequence , updateProjectTask , this.props.history);
  }

  render() {

    const {backlog_id} = this.props.match.params;
    const {
      id,
      projectSequence,
      summary,
      acceptanceCriteria,
      status,
      periority,
      dueDate,
      projectIdentifier,
      createdAt,
      errors
    } = this.state;
    return (
      <div className="add-PBI">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={`/projectBoard/${projectIdentifier}`} className="btn btn-light">
                Back to Project Board
              </Link>
              <h4 className="display-4 text-center">Update Project Task</h4>
              <p className="lead text-center">Project Name: {projectIdentifier} | Project Task ID: {projectSequence}</p>
              <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg",{'is-invalid': errors.summary})}
                    name="summary"
                    value={summary}
                    onChange={this.onChange.bind(this)}
                    placeholder="Project Task summary"
                  />
                  {errors.summary && (
                    <div className="invalid-feedback">{errors.summary}</div>
                  )}
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    placeholder="Acceptance Criteria"
                    name="acceptanceCriteria"
                    value={acceptanceCriteria}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
                <h6>Due Date</h6>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="dueDate"
                    value={dueDate}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
                <div className="form-group">
                  <select
                    className="form-control form-control-lg"
                    name="periority"
                    value={periority}
                    onChange={this.onChange.bind(this)}
                  >
                    <option value={0}>Select Priority</option>
                    <option value={1}>High</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Low</option>
                  </select>
                </div>

                <div className="form-group">
                  <select
                    className="form-control form-control-lg"
                    name="status"
                    value={status}
                    onChange={this.onChange.bind(this)}
                  >
                    <option value="">Select Status</option>
                    <option value="TO_DO">TO DO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <input
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UpdateProjectTask.propTypes = {
  getProjectTask: PropTypes.func.isRequired,
  project_task: PropTypes.object.isRequired,
  updateProjectTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  project_task: state.backlog.project_task,
  errors: state.errors
})

export default connect(mapStateToProps , {getProjectTask , updateProjectTask})(UpdateProjectTask);
