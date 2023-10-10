<script lang="ts" setup>
import type { ChannelInfo } from './RendererTypes';

const props = defineProps<{
  channelInfo: ChannelInfo | null;
  onCancel: () => void;
}>();
</script>

<template>
  <div class="versionChangePopupRoot">
    <div class="versionChangePopupContentWrapper">
      <div class="versionChangePopupTitle">Swap generator branch</div>

      <div class="versionChangePopupTableWrapper">
        <table class="versionChangePopupTable">
          <tbody>
            <tr>
              <td>name:</td>
              <td>{{ props?.channelInfo?.name }} </td>
            </tr>
            <tr>
              <td>version:</td>
              <td>{{ props?.channelInfo?.latestVersion }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="versionChangePopupBodyText">
        To swap to this branch of the generator, click "Start Download". Once the download is
        complete, the generator will restart to install the new version. This may take several
        seconds.
      </div>

      <div class="versionChangePopupBodyText">
        This is an non-stable branch. Backwards compatibility is not maintained. This will not
        affect your data on the stable branch.
      </div>

      <div class="versionChangePopupButtonsWrapper">
        <button @click="props.onCancel">Cancel</button>
        <button class="versionChangePopupButtonsRightBtn">Start Download</button>
      </div>
    </div>
  </div>
</template>

<style>
.versionChangePopupRoot {
  position: fixed;
  background-color: #fff;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.versionChangePopupContentWrapper {
  width: 450px;
  min-height: 500px;
  padding: 48px 40px 36px;
  border: 1px solid black;
  border-radius: 8px;
}

.versionChangePopupTitle {
  font-size: 24px;
}

.versionChangePopupTableWrapper {
  padding-top: 24px;
}

.versionChangePopupTable {
  margin: 0 auto;
}

.versionChangePopupTable td:first-child {
  text-align: right;
  color: #686868;
  padding: 2px 4px 2px 0;
}

.versionChangePopupTable td:not(:first-child) {
  text-align: left;
}

.versionChangePopupBodyText {
  padding-top: 24px;
}

.versionChangePopupButtonsWrapper {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 32px;
}

.versionChangePopupButtonsRightBtn {
  margin-left: auto;
}
</style>
