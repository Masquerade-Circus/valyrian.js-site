export default ({ title }, ...children) => {
  return (
    <div data-card="full-width" class="el-1">
      <header>
        <h1>{title}</h1>
      </header>
      <section v-if={children.length}>{children}</section>
    </div>
  );
};
