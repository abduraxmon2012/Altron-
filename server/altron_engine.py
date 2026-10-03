"""
ALTRON PYTHON SYMPY ENGINE (altron_engine.py)
Символьное аналитическое ядро высшей математики на базе SymPy
"""

import sympy as sp
import numpy as np

class AltronPyEngine:
    def __init__(self):
        self.x, self.y, self.z, self.t = sp.symbols('x y z t')

    def solve_equation(self, eq_str, var='x'):
        """Решение алгебраических и трансцендентных уравнений с пошаговыми комментариями"""
        v = sp.Symbol(var)
        if '=' in eq_str:
            lhs_str, rhs_str = eq_str.split('=', 1)
            eq = sp.Eq(sp.sympify(lhs_str), sp.sympify(rhs_str))
        else:
            eq = sp.Eq(sp.sympify(eq_str), 0)
        
        solutions = sp.solve(eq, v)
        latex_eq = sp.latex(eq)
        latex_sols = [sp.latex(s) for s in solutions]

        return {
            "equation_latex": latex_eq,
            "solutions": [str(s) for s in solutions],
            "solutions_latex": latex_sols,
            "count": len(solutions)
        }

    def differentiate(self, expr_str, var='x', order=1):
        """Аналитическое дифференцирование любого порядка"""
        v = sp.Symbol(var)
        expr = sp.sympify(expr_str)
        deriv = sp.diff(expr, v, order)

        return {
            "expression_latex": sp.latex(expr),
            "derivative": str(deriv),
            "derivative_latex": sp.latex(deriv),
            "order": order
        }

    def integrate(self, expr_str, var='x', a=None, b=None):
        """Неопределенный и определенный интегралы"""
        v = sp.Symbol(var)
        expr = sp.sympify(expr_str)

        if a is not None and b is not None:
            val = sp.integrate(expr, (v, sp.sympify(a), sp.sympify(b)))
            return {
                "type": "definite",
                "expression_latex": sp.latex(expr),
                "lower_bound": str(a),
                "upper_bound": str(b),
                "result": str(val),
                "result_latex": sp.latex(val)
            }
        else:
            antideriv = sp.integrate(expr, v)
            return {
                "type": "indefinite",
                "expression_latex": sp.latex(expr),
                "result": str(antideriv),
                "result_latex": sp.latex(antideriv) + " + C"
            }

    def compute_limit(self, expr_str, var='x', point='0', direction='+'):
        """Вычисление пределов"""
        v = sp.Symbol(var)
        expr = sp.sympify(expr_str)
        pt = sp.sympify(point)
        lim_val = sp.limit(expr, v, pt, dir=direction)

        return {
            "expression_latex": sp.latex(expr),
            "point": str(point),
            "result": str(lim_val),
            "result_latex": sp.latex(lim_val)
        }

    def matrix_operations(self, mat_list):
        """Матричные вычисления: определитель, обратная матрица, ранг, собственные значения"""
        M = sp.Matrix(mat_list)
        res = {
            "matrix_latex": sp.latex(M),
            "rows": M.rows,
            "cols": M.cols,
            "rank": M.rank()
        }
        if M.is_square:
            det = M.det()
            res["det"] = str(det)
            res["det_latex"] = sp.latex(det)
            if det != 0:
                res["inverse_latex"] = sp.latex(M.inv())
            res["eigenvals"] = {str(k): v for k, v in M.eigenvals().items()}
        return res
