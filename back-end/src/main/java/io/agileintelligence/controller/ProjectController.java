package io.agileintelligence.controller;

import io.agileintelligence.domain.Project;
import io.agileintelligence.service.MapValidationErrorService;
import io.agileintelligence.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
@CrossOrigin
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("")
    public ResponseEntity<?> createNewProject(@RequestBody @Valid Project project , BindingResult result , Principal principal) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationServiceError(result);
        if(errorMap != null){
            return errorMap;
        }
        Project projectSaved = projectService.saveOrUpdateProject(project , principal.getName());
        return new ResponseEntity<Project>(projectSaved , HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable("projectId") String projectId, Principal principal) {
        Project project = projectService.findProjectByIdentifier(projectId , principal.getName());
        return new ResponseEntity<Project>(project , HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<Iterable<Project>> getAllProjects(Principal principal) {
        Iterable<Project> projects = projectService.findAllProjects(principal.getName());
        return new ResponseEntity<Iterable<Project>>(projects , HttpStatus.OK);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProjectById(@PathVariable("projectId") String projectId, Principal principal) {
        projectService.deleteProjectByIdentifier(projectId.toUpperCase() , principal.getName());
        return new ResponseEntity<String>("Project with ID'" + projectId + "' was deleted " , HttpStatus.OK);
    }
}
