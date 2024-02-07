<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
  </ul>

  <svg class="hero-logo" viewBox="0 0 900 300">
    <use xlink:href="./icons.svg#electron" />
  </svg>
  <h2 class="hero-text">You've successfully created an Electron project with Vue and TypeScript</h2>
  <p class="hero-tagline">Please try pressing <code>F12</code> to open the devTool</p>

  <div class="links">
    <div class="link-item">
      <a target="_blank" href="https://electron-vite.org">Documentation</a>
    </div>
    <div class="link-item link-dot">•</div>
    <div class="link-item">
      <a target="_blank" href="https://github.com/alex8088/electron-vite">Getting Help</a>
    </div>
    <div class="link-item link-dot">•</div>
    <div class="link-item">
      <a
        target="_blank"
        href="https://github.com/alex8088/quick-start/tree/master/packages/create-electron"
      >
        create-electron
      </a>
    </div>
  </div>

  <div class="features">
    <div class="feature-item">
      <article>
        <h2 class="title">Configuring</h2>
        <p class="detail">
          Config with <span>electron.vite.config.ts</span> and refer to the
          <a target="_blank" href="https://electron-vite.org/config">config guide</a>.
        </p>
      </article>
    </div>
    <div class="feature-item">
      <article>
        <h2 class="title">HMR</h2>
        <p class="detail">
          Edit <span>src/renderer</span> files to test HMR. See
          <a target="_blank" href="https://electron-vite.org/guide/hmr.html">docs</a>.
        </p>
      </article>
    </div>
    <div class="feature-item">
      <article>
        <h2 class="title">Hot Reloading</h2>
        <p class="detail">
          Run <span>'electron-vite dev --watch'</span> to enable. See
          <a target="_blank" href="https://electron-vite.org/guide/hot-reloading.html">docs</a>.
        </p>
      </article>
    </div>
    <div class="feature-item">
      <article>
        <h2 class="title">Debugging</h2>
        <p class="detail">
          Check out <span>.vscode/launch.json</span>. See
          <a target="_blank" href="https://electron-vite.org/guide/debugging.html">docs</a>.
        </p>
      </article>
    </div>
    <div class="feature-item">
      <article>
        <h2 class="title">Source Code Protection</h2>
        <p class="detail">
          Supported via built-in plugin <span>bytecodePlugin</span>. See
          <a target="_blank" href="https://electron-vite.org/guide/source-code-protection.html">
            docs
          </a>
          .
        </p>
      </article>
    </div>
    <div class="feature-item">
      <article>
        <h2 class="title">Packaging</h2>
        <p class="detail">
          Use
          <a target="_blank" href="https://www.electron.build">electron-builder</a>
          and pre-configured to pack your app.
        </p>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const versions = reactive({ ...window.electron.process.versions });
</script>

<style lang="scss">
body {
  display: flex;
  flex-direction: column;
  font-family:
    Roboto,
    -apple-system,
    BlinkMacSystemFont,
    "Helvetica Neue",
    "Segoe UI",
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    sans-serif;
  color: #86a5b1;
  background-color: #2f3241;
}

code {
  padding: 3px 5px;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono",
    monospace;
  font-size: 85%;
  font-weight: 600;
  background-color: #26282e;
  border-radius: 2px;
}

a {
  font-weight: 600;
  color: #9feaf9;
  text-decoration: none;
  cursor: pointer;
  outline: none;
}

a:hover {
  border-bottom: 1px solid;
}

#app {
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 840px;
  padding: 15px 30px 0;
  margin: 0 auto;
}

.versions {
  float: none;
  margin: 0 auto;
  overflow: hidden;
  clear: both;
  font-family: Menlo, "Lucida Console", monospace;
  line-height: 1;
  color: #c2f5ff;
  transition: all 0.3s;

  li {
    display: block;
    float: left;
    padding: 0 20px;
    font-size: 13px;
    border-right: 1px solid rgb(194 245 255 / 40%);
    opacity: 0.8;

    &:last-child {
      border: none;
    }
  }
}

.hero-logo {
  margin-top: -0.4rem;
  transition: all 0.3s;
}

@media (width <= 840px) {
  .versions {
    display: none;
  }

  .hero-logo {
    margin-top: -1.5rem;
  }
}

.hero-text {
  margin-top: -0.5rem;
  margin-bottom: 10px;
  font-weight: 400;
  color: #c2f5ff;
  text-align: center;
}

@media (width <= 660px) {
  .hero-logo {
    display: none;
  }

  .hero-text {
    margin-top: 20px;
  }
}

.hero-tagline {
  margin-bottom: 14px;
  text-align: center;
}

.links {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 500;

  a {
    font-weight: 500;
  }

  .link-item {
    padding: 0 4px;
  }
}

.features {
  display: flex;
  flex-wrap: wrap;
  margin: -6px;

  .feature-item {
    box-sizing: border-box;
    width: 33.33%;
    padding: 6px;
  }

  article {
    box-sizing: border-box;
    height: 100%;
    padding: 12px;
    background-color: rgb(194 245 255 / 10%);
    border-radius: 8px;
  }

  span {
    color: #d4e8ef;
    word-break: break-all;
  }

  .title {
    overflow: hidden;
    font-size: 17px;
    font-weight: 500;
    line-height: 22px;
    color: #c2f5ff;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detail {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
  }
}

@media (width <= 660px) {
  .features .feature-item {
    width: 50%;
  }
}

@media (width <= 480px) {
  .links {
    flex-direction: column;
    line-height: 32px;

    .link-dot {
      display: none;
    }
  }

  .features .feature-item {
    width: 100%;
  }
}
</style>
