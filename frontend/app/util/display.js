// TOOD: no need for class with static methods, just export functions

/**
 * Class exposing static methods for common display tasks.
 */
export default class DisplayUtil {
  /**
   * Display the element only if the condition is met.
   *
   * @param {Boolean} condition Boolean condition that evaluates to true to display; false otherwise.
   * @param {Function} elementIfCondition A zero-argument lambda function that returns the element to render if the
   *                                      condition is true.
   * @param {Function=} elementElseCondition A zero-argument lambda function that returns the element to render if the
   *                    condition is false.
   * @returns {Object} The output of element() or undefined, depending on condition.
   */
  static displayIf(condition, elementIfCondition, elementElseCondition) {
    return condition ?
      elementIfCondition() :
      (DisplayUtil.isDefined(elementElseCondition) ? elementElseCondition() : undefined);
  }

  /**
   * Check if the entity is properly defined.
   * In order words, it must be not undefined, not null, and of nonzero length if it is a string.
   *
   * @param {*} entity Entity to check.
   * @returns {boolean} True if the element is properly defined; false otherwise.
   */
  static isDefined(entity) {
    return entity !== undefined && entity !== null && (typeof entity === 'string' ? entity.length > 0 : true);
  }
}
