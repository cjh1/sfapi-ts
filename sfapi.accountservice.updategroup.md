<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@cjh1/sfapi](./sfapi.md) &gt; [AccountService](./sfapi.accountservice.md) &gt; [updateGroup](./sfapi.accountservice.updategroup.md)

## AccountService.updateGroup() method

Update Group Membership Update a group's membership.

- \*\*group\*\*: the name of the group - \*\*usernames\*\*: a comma-delimited list of usernames - \*\*action\*\*: the action to take: either `batch_add` or `batch_remove`

**Signature:**

```typescript
updateGroup(group: string, formData: UpdateGroupBody): CancelablePromise<GroupStats>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  group | string |  |
|  formData | [UpdateGroupBody](./sfapi.updategroupbody.md) |  |

**Returns:**

[CancelablePromise](./sfapi.cancelablepromise.md)<!-- -->&lt;[GroupStats](./sfapi.groupstats.md)<!-- -->&gt;

GroupStats Successful Response

## Exceptions

ApiError
