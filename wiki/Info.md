Shows information about the current pagination

```jsx
type InfoPropTypes = {
  shown: number;
  total: number;
  one: string;
  all: string;
};
```

# Example 
```jsx
<Info
  all="companies"
  one="company"
  shown={paginator.items.size}
  total={paginator.total}
/>
```