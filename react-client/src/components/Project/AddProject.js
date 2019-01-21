import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createProject} from '../../actions/projectActions';
import classnames from 'classnames';

 class AddProject extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      projectName: '',
      projectIdentifier: '',
      description: '',
      start_date: '',
      end_date: '',
      errors: {}
    }

  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }
  onSubmit(e){
    e.preventDefault();
    const { projectName ,  projectIdentifier , description , start_date , end_date} = this.state;
    const newProject = {
      projectName: projectName,
      projectIdentifier: projectIdentifier,
      description: description,
      start_date: start_date,
      end_date: end_date
    }
    this.props.createProject(newProject , this.props.history);
  }
  render() {

    const { projectName ,  projectIdentifier , description , start_date , end_date , errors} = this.state;

    return (
      
      <div className="project">
      
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h5 className="display-4 text-center">
                Create Project form
              </h5>
              <hr/>
              <form onSubmit={this.onSubmit.bind(this)}>
                <div className="form-group">
                  <input type="text" 
                         className={classnames("form-control form-control-lg",{'is-invalid': errors.projectName})}
                         name="projectName" 
                         value={projectName}
                         onChange={this.onChange.bind(this)}
                         placeholder="Project Name"/>
                  {errors.projectName && (
                    <div className="invalid-feedback">{errors.projectName}</div>
                  )}
                </div>
                <div className="form-group">
                  <input type="text" 
                         className={classnames("form-control form-control-lg",{'is-invalid': errors.projectIdentifier})}
                         name="projectIdentifier"
                         value={projectIdentifier}
                         onChange={this.onChange.bind(this)}
                         placeholder="Unique Project ID"/>
                  {errors.projectIdentifier && (
                    <div className="invalid-feedback">{errors.projectIdentifier}</div>
                  )}
                </div>
                <div className="form-group">
                  <textarea className={classnames("form-control form-control-lg",{'is-invalid': errors.description})}
                            name="description" 
                            value={description}
                            onChange={this.onChange.bind(this)}
                            placeholder="Project Description" cols="30" rows="6"></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>
                <h6>Start Date</h6>
                <div className="form-group">
                  <input type="date" className="form-control form-control-lg" 
                  value={start_date} name="start_date" onChange={this.onChange.bind(this)}/>
                </div>
                <h6>Estimated End Date</h6>
                <div className="form-group">
                  <input type="date" className="form-control form-control-lg" 
                  value={end_date} name="end_date" onChange={this.onChange.bind(this)}/>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-4">Submit</button>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    )
  }
}

AddProject.propTypes = {
  createProject: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(mapStateToProps, {createProject})(AddProject);