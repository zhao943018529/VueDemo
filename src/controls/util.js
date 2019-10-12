function getPostionOfParent(parent, element) {
    parent = parent || element.parentElement;

    return {
        offsetTop: element.offsetTop - parent.offsetTop,
        offsetLeft: element.offsetLeft - parent.offsetLeft,
    };
}

function getStyle(element, prop) {
    return parseFloat(element.style[prop]);
}

const directProps=['scrollTop','scrollLeft','offsetTop','offsetLeft','offsetWidth','offsetHeight'];

function css(element, prop, val) {
    const isItself = directProps.indexOf(prop)>-1;
    if (val) {
        if (typeof val === 'number' && prop != 'opacity'&&!isItself) val += "px";
        if(isItself){
            element[prop] = val;
        }else{
            element.style[prop] = val;
        }
    } else {
        return isItself?element[prop]:element.style[prop];
    }
};

function animation(element, duration, prop, val) {
    let progress = parseFloat(css(element, prop));
    let distance = val - progress;
    const interval = 50;
    duration *= 1000;
    let speed = distance / Math.ceil(duration / interval);
    speed = Math.min(Math.abs(speed), 2) * (speed > 0 ? 1 : -1);
    let timeId = null;
    function next() {
        if(speed>0){
            progress = Math.min(val, progress + speed);
        }else{
            progress = Math.max(val, progress + speed);
        }
        css(element, prop, progress);
        if (progress != val) {
            timeId = setTimeout(next, interval);
        }
    }

    next();
};

//position top center bottom
function scrollInToView(container, target, position) {
    const containerHeight = container.clientHeight;
    const scrollElement = container.firstElementChild;
    const scrollHeight = scrollElement.scrollHeight;
    const height = target.offsetHeight;
    const positionInfo = getPostionOfParent(scrollElement, target);
    let finalOffset;
    switch (position) {
        case 'top':
            finalOffset = Math.max(0, positionInfo.offsetTop - (Math.min(0, scrollHeight - positionInfo.offsetTop - containerHeight)));
            break;
        case 'bottom':
            finalOffset = Math.max(positionInfo.offsetTop + height - containerHeight, 0);
            break;
        default:
            finalOffset = Math.max(positionInfo.offsetTop + .5 * height - 0.5 * containerHeight, 0);
            break;
    }
    animation(container, 4, 'scrollTop', finalOffset);
};

export {
    scrollInToView,
};