import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import { addProjectTask } from '../../../actions/backlogActions';

class AddProjectTask extends Component {

  constructor(props) {
    super(props);
    const {id} = this.props.match.params;
    this.state = {
      'summary': '',
      'acceptanceCriteria': '',
      'status': '',
      'periority': 0,
      'dueDate': '',
      'projectIdentifier': id,
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  onSubmit(e){
    e.preventDefault();
    const {summary , acceptanceCriteria , status , periority , dueDate , projectIdentifier , errors} = this.state;
    const newProjectTask = {
      'summary': summary,
      'acceptanceCriteria': acceptanceCriteria,
      'status': status,
      'periority': periority,
      'dueDate': dueDate,
    };
    this.props.addProjectTask(projectIdentifier , newProjectTask , this.props.history);
  }

  render() {
    const {id} = this.props.match.params;
    const {summary , acceptanceCriteria , status , periority , dueDate , projectIdentifier , errors} = this.state;
    return (
      <div className="add-PBI">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to={`/projectBoard/${id}`} className="btn btn-light">
                Back to Project Board
              </Link>
              <h4 className="display-4 text-center">Add Project Task</h4>
              <p className="lead text-center">Project Name + Project Code</p>
              <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames("form-control form-control-lg",{'is-invalid': errors.summary})}
                    name="summary"
                    placeholder="Project Task summary"
                    value={summary}
                    onChange={this.onChange.bind(this)}
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

AddProjectTask.propTypes = {
  addProjectTask: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(mapStateToProps , {addProjectTask})(AddProjectTask);
