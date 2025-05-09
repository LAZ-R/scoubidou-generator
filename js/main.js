import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { getSvgIcon } from "./services/icons.service.js";
import { logAppInfos, setHTMLTitle } from "./utils/UTILS.js";
import { setStorage } from "./services/storage.service.js";
import { getUser } from "./services/storage.service.js";
import { MESHES } from "./data/environments.data.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');

// FORM ################################################################
let MESH_TYPE = '4 brins';
let STARTING_POSITION = 'clockwise';
let PATTERN_TYPE = 'straight';
let STRANDS_TYPE = 'dual';

const setForm = () => {
  const form = document.getElementById('mainForm');
  form.innerHTML = '';

  let meshTypeFormBlocStr = `
  <div class="form-bloc">
    <label class="bloc-title" for="meshTypeSelect">Type de maille</label>
    <select class="flat" name="meshType" id="meshTypeSelect" onchange="onMeshTypeChange(event)">`;
  for (const mesh of MESHES) {
    meshTypeFormBlocStr += `<option value="${mesh.name}" ${mesh.name == MESH_TYPE ? 'selected' : ''}>${mesh.name}</option>`
  }
  meshTypeFormBlocStr += `
      </select>
    </div>`;

  form.innerHTML += meshTypeFormBlocStr;
  form.innerHTML += `
    <div class="form-bloc">
      <span class="bloc-title" for="startingPosition">Maille de départ</span>
      <span class="radio-container">
        <input type="radio" id="clockwise" name="startingPosition" value="clockwise" checked onchange="onStartingPositionChange(event)">
        <label for="clockwise">Horaire</label>
      </span>
      <span class="radio-container">
        <input type="radio" id="counterclockwise" name="startingPosition" value="counterclockwise" onchange="onStartingPositionChange(event)">
        <label for="counterclockwise">Antihoraire</label>
      </span>
    </div>

    <!-- Type de motif -->
    <div class="form-bloc">
      <span class="bloc-title" for="patternType">Types de motif</span>
      <span class="radio-container">
        <input type="radio" id="straightPattern" name="patternType" value="straight" checked onchange="onPatternTypeChange(event)">
        <label for="straightPattern">Droit</label>
      </span>
      <span class="radio-container">
        <input type="radio" id="rotatingPattern" name="patternType" value="rotating" onchange="onPatternTypeChange(event)">
        <label for="rotatingPattern">Torsadé</label>
      </span>
    </div>

    <div class="form-bloc">
      <span class="bloc-title" for="strandsType">Types de brins</span>
      <span class="radio-container">
        <input type="radio" id="dualStrand" name="strandsType" value="dual" checked onchange="onStrandsTypeChange(event)">
        <label for="dualStrand">1 fil = 2 brins</label>
      </span>
      <span class="radio-container">
        <input type="radio" id="singleStrand" name="strandsType" value="single" onchange="onStrandsTypeChange(event)">
        <label for="singleStrand">1 fil = 1 brins</label>
      </span>
    </div>`;
}

// MESH TYPE ===========================================
const onMeshTypeChange = (meshTypeEvent) => {
  const meshType = meshTypeEvent.target.value;
  MESH_TYPE = meshType;
  setMeshImg();
  setColorPickers();
  setVisualizer();
}
window.onMeshTypeChange = onMeshTypeChange;

// STARTING POSITION ===========================================
const onStartingPositionChange = (event) => {
  if (event.target.checked) {
    STARTING_POSITION = event.target.value;
    setVisualizer();
  }
}
window.onStartingPositionChange = onStartingPositionChange;

// PATTERN TYPE ===========================================
const onPatternTypeChange = (patternTypeEvent) => {
  const patternType = patternTypeEvent.target.value;
  PATTERN_TYPE = patternType;
  setVisualizer();
}
window.onPatternTypeChange = onPatternTypeChange;

// STRANDS TYPE ===========================================
const onStrandsTypeChange = (strandsTypeEvent) => {
  const strandsType = strandsTypeEvent.target.value;
  STRANDS_TYPE = strandsType;
  setCSSColors();
  setColorPickers();
}
window.onStrandsTypeChange = onStrandsTypeChange;

// MESH IMG #####################################################
const getMeshImgArrayByMeshName = (meshName) => {
  for (const mesh of MESHES) {
    if (mesh.name == meshName) {
      return mesh.mesh_img_array;
    }
  }
}

const setMeshImg = () => {
  //console.log(MESH_TYPE);
  let meshImgArray = getMeshImgArrayByMeshName(MESH_TYPE);
  const container = document.getElementById('meshImgContainer');
  container.innerHTML = '';
  container.innerHTML = getMeshImgHtmlByArray(meshImgArray);
}

const getMeshImgHtmlByArray = (meshImgArray) => {
  let str = '<div class="mesh-img">';
  for (const cell of meshImgArray) {
    str += getMeshImgCellHtml(cell);
  }
  str += '</div>';
  return str;
}

const getMeshImgCellHtml = (cell) => {
  return `<span id="${cell.id}" class="${cell.color} ${cell.round_class}"><span class="hiddable-cell-text">${cell.id}</span>${cell.text == '' ? '' : `<span class="cell-text">${cell.text}</span>`}</span>`;
}

// VISUALIZER ###################################################

const getRotatingColumnGroupHtml = (roundPattern, groupNumber)=>  {
  let column1String = '';
  for (let cellColor of roundPattern.column_1) {
    column1String += `<div class="cell ${cellColor}"></div>`;
  }
  let column2String = '';
  for (let cellColor of roundPattern.column_2) {
    column2String += `<div class="cell ${cellColor}"></div>`;
  }
  return `
    <div class="column-container column-group-${groupNumber}">
      <div class="visualizer-column column-1">
        ${column1String}
      </div>
      <div class="visualizer-column column-2">
        ${column2String}
      </div>
    </div>
  `;
}

const getVisualizerRotatingRowHtml = (roundPattern) => {
  return `
    <div class="visualizer-row">
      ${getRotatingColumnGroupHtml(roundPattern, 1)}
      ${getRotatingColumnGroupHtml(roundPattern, 2)}
    </div>
  `;
}

const setVisualizer = () => {
  const mesh = getMeshByMeshName(MESH_TYPE);
  const meshContainer = document.getElementById('meshImgContainer');
  const visualizer = document.getElementById('visualizer');

  visualizer.innerHTML = '';
  if (PATTERN_TYPE == 'straight') {
    visualizer.innerHTML = `
      ${getStraightVisualizerHtml()}
    `;
  } else if (PATTERN_TYPE == 'rotating') {
    visualizer.innerHTML = `
      ${getVisualizerRotatingRowHtml(mesh.round_pattern)}
      ${getVisualizerRotatingRowHtml(mesh.round_pattern)}
    `;
  }

  switch (STARTING_POSITION) {
    case 'clockwise':
      meshContainer.classList.remove('mirror');
      visualizer.classList.remove('mirror');
      break;
    case 'counterclockwise':
      meshContainer.classList.add('mirror');
      visualizer.classList.add('mirror');
        break;
    default:
      break;
  }
  if (PATTERN_TYPE == 'straight') {
    visualizer.classList.remove('mirror');
  }
  //console.log(PATTERN_TYPE)
  
}

const getStraightFaceRow = (faceArray) => {
  let str = '<div class="face-row">';
  for (let color of faceArray) {
    let index = faceArray.indexOf(color);
    let isEven = !(index % 2);

    str += `<div class="cell color-${color} ${isEven ? '' : 'cell-alt'}"></div>`;
  }
  str += '</div>';
  return str;
}

const getStraightFaceHtml = (faceType) => {
  const rowCount = 5;
  let str = `<div class="face ${faceType}">`;
  let rowStr = '';
  const mesh = getMeshByMeshName(MESH_TYPE);
  switch (faceType) {
    case 'north':
      rowStr = getStraightFaceRow(mesh.straight_pattern.north);
      break;
    case 'east':
      rowStr = getStraightFaceRow(mesh.straight_pattern.east);
      break;
    case 'south':
      rowStr = getStraightFaceRow(mesh.straight_pattern.south);
      break;
    case 'west':
      rowStr = getStraightFaceRow(mesh.straight_pattern.west);
      break;
    default:
      break;
  }
  for (let index = 0; index < rowCount; index++) {
    str += `${rowStr}`;
  }
  str += `</div>`;
  return str;
}

const getStraightVisualizerHtml = () => {
  return `
    <div class="straight">
      <table>
        <tr>
          <th>Face Nord</th>
          <th>Face Est</th>
        </tr>
        <tr>
          <td>
            <!-- NORTH -->
            ${STARTING_POSITION == 'clockwise' ? getStraightFaceHtml('north') : getStraightFaceHtml('south')}
          </td>
          <td>
            <!-- EAST -->
            ${getStraightFaceHtml('east')}
          </td>
        </tr>
        <tr>
          <th>Face Sud</th>
          <th>Face Ouest</th>
        </tr>
        <tr>
          <td>
            <!-- SOUTH -->
            ${STARTING_POSITION == 'clockwise' ? getStraightFaceHtml('south') : getStraightFaceHtml('north')}
          </td>
          <td>
            <!-- WEST -->
            ${getStraightFaceHtml('west')}
          </td>
        </tr>
      </table>
    </div>
  `;
}

// COLORS #######################################

const setCSSColors = () => {
  const ROOT = document.querySelector(':root');
  switch (STRANDS_TYPE) {
    case 'dual':
      ROOT.style.setProperty('--color-1B', 'var(--color-1A)');
      ROOT.style.setProperty('--color-2B', 'var(--color-2A)');
      ROOT.style.setProperty('--color-3B', 'var(--color-3A)');
      ROOT.style.setProperty('--color-4B', 'var(--color-4A)');
      break;
    case 'single':
      ROOT.style.setProperty('--color-1B', document.getElementById('strand1BPickerInput').value);
      ROOT.style.setProperty('--color-2B', document.getElementById('strand2BPickerInput').value);
      ROOT.style.setProperty('--color-3B', document.getElementById('strand3BPickerInput').value);
      ROOT.style.setProperty('--color-4B', document.getElementById('strand4BPickerInput').value);
      break;
    default:
      break;
  }
}

const getMeshByMeshName = (meshName) => {
  for (const mesh of MESHES) {
    if (mesh.name == meshName) {
      return mesh;
    }
  }
}

const setColorPickers = () => {

  document.getElementById('strand1BPicker').classList.remove('hidden');
  document.getElementById('strand2BPicker').classList.remove('hidden');
  document.getElementById('strand3APicker').classList.remove('hidden');
  document.getElementById('strand3BPicker').classList.remove('hidden');
  document.getElementById('strand4APicker').classList.remove('hidden');
  document.getElementById('strand4BPicker').classList.remove('hidden');

  const strandCount = getMeshByMeshName(MESH_TYPE).strand_count;

  document.getElementById('strand1AText').innerHTML = STRANDS_TYPE == 'single' ? 'Brin 1A' : 'Fil 1';
  document.getElementById('strand2AText').innerHTML = STRANDS_TYPE == 'single' ? 'Brin 2A' : 'Fil 2';
  document.getElementById('strand3AText').innerHTML = STRANDS_TYPE == 'single' ? 'Brin 3A' : 'Fil 3';
  document.getElementById('strand4AText').innerHTML = STRANDS_TYPE == 'single' ? 'Brin 4A' : 'Fil 4';

  if (STRANDS_TYPE == 'dual') {
    document.getElementById('strand1BPicker').classList.add('hidden');
    document.getElementById('strand2BPicker').classList.add('hidden');
    document.getElementById('strand3BPicker').classList.add('hidden');
    document.getElementById('strand4BPicker').classList.add('hidden');
  }

  if (strandCount < 6) {
    document.getElementById('strand3APicker').classList.add('hidden');
    document.getElementById('strand3BPicker').classList.add('hidden');
  }
  if (strandCount < 8) {
    document.getElementById('strand4APicker').classList.add('hidden');
    document.getElementById('strand4BPicker').classList.add('hidden');
  }
}

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

const onStrandColorChange = (color, strandId) => {
  //console.log(color);
  //console.log(strandId);
  document.querySelector(':root').style.setProperty(`--color-${strandId}`, `${color}`);
}
window.onStrandColorChange = onStrandColorChange;



// USER INTERACTIONS ##########################################################

// HEADER =================================================
const onHeaderButtonClick = () => {
  console.log('clicked on headerbutton');
  
}
window.onHeaderButtonClick = onHeaderButtonClick;

// HOMEPAGE ===============================================



// IHM RENDER #################################################################

// HOMEPAGE ===============================================

const renderHomepageHeader = () => {
  HEADER.innerHTML = `
    <p>${APP_NAME} v ${APP_VERSION}</p>
    <!-- <button onclick="onHeaderButtonClick()" class="button outlined primary" style="padding: 4px 8px;">
      ${getSvgIcon('list', 's')}
      button
    </button> -->
  `;
}

const setHomepage = () => {
  setHTMLTitle(APP_NAME);
  renderHomepageHeader();

  setForm();
  setMeshImg();
  setCSSColors();
  setColorPickers();
  setVisualizer();
}


// INITIALIZATION /////////////////////////////////////////////////////////////////////////////////

logAppInfos(APP_NAME, APP_VERSION);
setHTMLTitle(APP_NAME);
//setStorage();


// EXECUTION //////////////////////////////////////////////////////////////////////////////////////
setHomepage();