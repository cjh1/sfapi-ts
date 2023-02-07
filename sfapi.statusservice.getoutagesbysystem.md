<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [sfapi](./sfapi.md) &gt; [StatusService](./sfapi.statusservice.md) &gt; [getOutagesBySystem](./sfapi.statusservice.getoutagesbysystem.md)

## StatusService.getOutagesBySystem() method

Read Outage Get information about NERSC outages for a specific system.

- \*\*name\*\*: the name of the NERSC resource to query

**Signature:**

```typescript
getOutagesBySystem(name: string): CancelablePromise<Array<Outage>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  name | string |  |

**Returns:**

[CancelablePromise](./sfapi.cancelablepromise.md)<!-- -->&lt;Array&lt;[Outage](./sfapi.outage.md)<!-- -->&gt;&gt;

Outage Successful Response

## Exceptions

ApiError
