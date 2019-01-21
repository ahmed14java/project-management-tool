package io.agileintelligence.controller;

import io.agileintelligence.domain.ProjectTask;
import io.agileintelligence.service.MapValidationErrorService;
import io.agileintelligence.service.ProjectTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/backlog")
@CrossOrigin
public class BacklogController {

    @Autowired
    private ProjectTaskService projectTaskService;

    @Autowired
    private MapValidationErrorService mapValidationErrorService;

    @PostMapping("/{baclog_id}")
    public ResponseEntity<?> addProjectTaskToBacklog(@Valid @RequestBody ProjectTask projectTask , BindingResult result
            , @PathVariable String baclog_id , Principal principal) {
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationServiceError(result);
        if(errorMap != null){
            return errorMap;
        }
        ProjectTask projectTask1 = projectTaskService.addProjectTask(baclog_id , projectTask , principal.getName());
        return new ResponseEntity<ProjectTask>(projectTask1 , HttpStatus.CREATED);
    }

    @GetMapping("/{baclog_id}")
    public ResponseEntity<Iterable<ProjectTask>> getProjectTasksOfBacklog(@PathVariable String baclog_id , Principal principal){
        Iterable<ProjectTask> projectTasks = projectTaskService.findByBacklogId(baclog_id , principal.getName());
        return new ResponseEntity<Iterable<ProjectTask>>(projectTasks , HttpStatus.OK);
    }

    @GetMapping("/{baclog_id}/{pt_id}")
    public ResponseEntity<?> getProjectTask(@PathVariable String baclog_id , @PathVariable String pt_id, Principal principal) {
        ProjectTask projectTask = projectTaskService.findPTByProjectSequence(baclog_id , pt_id , principal.getName());
        return new ResponseEntity<ProjectTask>(projectTask , HttpStatus.OK);
    }

    @PatchMapping("/{backlog_id}/{pt_id}")
    public ResponseEntity<?> updateProjectTask(@Valid @RequestBody ProjectTask projectTask , BindingResult result
            , @PathVariable String backlog_id , @PathVariable String pt_id, Principal principal){
        ResponseEntity<?> errorMap = mapValidationErrorService.MapValidationServiceError(result);
        if(errorMap != null){
            return errorMap;
        }
        ProjectTask updatedTask = projectTaskService.updateByProjectSequense(projectTask , backlog_id , pt_id ,  principal.getName());
        return new ResponseEntity<ProjectTask>(updatedTask , HttpStatus.OK);
    }

    @DeleteMapping("/{backlog_id}/{pt_id}")
    public ResponseEntity<?> deleteProjectTask(@PathVariable String backlog_id , @PathVariable String pt_id, Principal principal){
        projectTaskService.deletePTByProjectSequence(backlog_id , pt_id ,  principal.getName());
        return new ResponseEntity<String>("Project Task '" + pt_id + "' was deleted successfuly" , HttpStatus.OK);
    }
}
