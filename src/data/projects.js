import vision from './vision.json'
import tibet from './tibet.json'
import airclub from './airclub.json'
import webdocumentary from './webdocumentary.json'
import travelagency from './travelagency.json'
import passwordgenerator from './passwordgenerator.json'
import javabanking from './java-banking.json'
import logcleaner from './logcleaner.json'

export const projects = [
    vision, 
    tibet, 
    airclub, 
    webdocumentary, 
    travelagency, 
    passwordgenerator,
    javabanking,
    logcleaner
]

export const getProjectById = (id) => projects.find(p => p.id === id)