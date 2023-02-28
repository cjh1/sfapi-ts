<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@cjh1/sfapi](./sfapi.md) &gt; [AccountService](./sfapi.accountservice.md) &gt; [getGroup](./sfapi.accountservice.getgroup.md)

## AccountService.getGroup() method

Read Group Get information about a filegroup.

- \*\*group\*\*: the name of the group

**Signature:**

```typescript
getGroup(group: string): CancelablePromise<GroupStats>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  group | string |  |

**Returns:**

[CancelablePromise](./sfapi.cancelablepromise.md)<!-- -->&lt;[GroupStats](./sfapi.groupstats.md)<!-- -->&gt;

GroupStats Successful Response

## Exceptions

ApiError
