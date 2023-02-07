<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [sfapi](./sfapi.md) &gt; [ComputeService](./sfapi.computeservice.md) &gt; [submitJob](./sfapi.computeservice.submitjob.md)

## ComputeService.submitJob() method

Submit Job Submit a job to run on a NERSC compute resource.

- \*\*machine\*\*: the machine to run the job on. - \*\*job\*\*: either a path to the job script, or the job script itself - \*\*isPath\*\*: if true, the job parameter is a path

If successful this api will return a task\_id which you can look up via the /tasks/task api. Once the job has been scheduled, the task body will contain the job id.

**Signature:**

```typescript
submitJob(machine: PublicHost, formData: SubmitJobBody): CancelablePromise<ComputeCommandOutput>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  machine | [PublicHost](./sfapi.publichost.md) |  |
|  formData | [SubmitJobBody](./sfapi.submitjobbody.md) |  |

**Returns:**

[CancelablePromise](./sfapi.cancelablepromise.md)<!-- -->&lt;[ComputeCommandOutput](./sfapi.computecommandoutput.md)<!-- -->&gt;

app\_\_routers\_\_compute\_\_models\_\_CommandOutput Successful Response

## Exceptions

ApiError
