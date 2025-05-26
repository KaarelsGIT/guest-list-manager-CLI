# How to use message
***

1) declare a variable:
```typescript
message: AppMessage | null = null;
```
2) in template:
```typescript
<app-message
    * ngIf = "message"
    [message] = "message"
    (closed) = "message = null" > 
</app-message>
```

3) trigger in code:
```typescript
this.message = {
  text: 'Guest added successfully',
  type: 'success',
  modal: true,
  duration: 3000
};
```
***
