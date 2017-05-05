'use strict';

import {TriangleField} from "./triangle_field";
import {ConfigContext} from "../experimental/context";
import {Platform} from "./platform";
import {getOffsetChecker} from "../base/geometry";


export function platformFromTriangleField(triangleField: TriangleField) {
    const platformConfig = ConfigContext.getInstance().get('platform');

    const relativeDistance = platformConfig.relativeDistance;
    const relativeLength = platformConfig.relativeLength;
    const totalLength = triangleField.getWidthOnRelativeDistance(relativeDistance);
    const platformLength = totalLength * relativeLength;

    const platformWidth = platformConfig.aspectRatio * platformLength;
    const platform = new Platform(platformLength, platformWidth);

    // using such coordinates because triangleField coordinate system origin is in the topmost corner.
    const position = triangleField.toGlobals([0, -triangleField.height * (1 - relativeDistance)]);
    const rotation = triangleField.rotation;

    platform.moveTo(position);
    platform.rotateTo(rotation);

    platform.positionValidator = getOffsetChecker(platform, triangleField);
    triangleField.addChild(platform);

    return platform;
}
