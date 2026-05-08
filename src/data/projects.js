import vision from './vision.json'
import tibet from './tibet.json'
import airclub from './airclub.json'
import webdocumentary from './webdocumentary.json'
import travelagency from './travelagency.json'
import passwordgenerator from './passwordgenerator.json'

export const projects = [
    vision, 
    tibet, 
    airclub, 
    webdocumentary, 
    travelagency, 
    passwordgenerator
]

export const getProjectById = (id) => projects.find(p => p.id === id)