const dragContainers = document.querySelectorAll(".drag-container");

dragContainers.forEach(dragContainer => {
    dragContainer.addEventListener('dragenter', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(dragContainer, e.clientY);
        const draggable = document.querySelector('.dragging');
        let dragContainerID = dragContainer.id;
        let status = dragContainerID.substring(0, dragContainerID.indexOf("-"));
        if (status.localeCompare("in") == 0) {
            status = "in-progress"
        }
        console.log(status);
        if (afterElement == null) {
            var createTaskElem = document.getElementById("create-task-" + status);
            dragContainer.insertBefore(draggable, createTaskElem);
        } else {
            dragContainer.insertBefore(draggable, afterElement);
        }
    })
    dragContainer.addEventListener('drop', () => {
        console.log("success");
    })
})

function getDragAfterElement(dragContainer, y) {
    const draggableElements = [...dragContainer.querySelectorAll('.draggable:not(.dragging)')]
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return{ offset: offset, element: child}
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}