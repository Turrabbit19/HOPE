@extends('client.master')
@section('content')
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
        }

        .container {
            padding: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            table-layout: fixed;
        }

        th,
        td {
            padding: 10px;
            border: 1px solid #ccc;
        }

        th {
            background-color: #f4f4f4;
        }

        .event {
            padding: 10px;
            color: white;
            border-radius: 8px;
        }

        .dance {
            background-color: #00bcd4;
        }

        .yoga {
            background-color: #4caf50;
        }

        .music {
            background-color: #ffeb3b;
            color: black;
        }

        .art {
            background-color: #9c27b0;
        }

        .english {
            background-color: #e91e63;
        }

        .break {
            background-color: #ff5722;
        }
    </style>
    <div class="breadcrumbs-area">
        {{-- <h3>Admin Dashboard</h3> --}}
        <ul>
            <li>
                <a href="index.html">Home</a>
            </li>
            <li>schedules</li>
        </ul>
    </div>
    <div class="col-12-xxxl col-12">
        <div class="card dashboard-card-six">
            <div class="card-body">
                <div class="container">
                    <table>
                        <thead>
                            <tr>
                                <th>TIME</th>
                                <th>MONDAY</th>
                                <th>TUESDAY</th>
                                <th>WEDNESDAY</th>
                                <th>THURSDAY</th>
                                <th>FRIDAY</th>
                                <th>SATURDAY</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>09:00am</td>
                                <td>
                                    <div class="event dance">Dance<br>9:00-10:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event yoga">Yoga<br>9:00-10:00<br><small>Marta
                                            Healy</small></div>
                                </td>
                                <td>
                                    <div class="event music">Music<br>9:00-10:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event dance">Dance<br>9:00-10:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event art">Art<br>9:00-10:00<br><small>Kate
                                            Alley</small></div>
                                </td>
                                <td>
                                    <div class="event english">English<br>9:00-10:00<br><small>James
                                            Smith</small></div>
                                </td>
                            </tr>
                            <tr>
                                <td>10:00am</td>
                                <td>
                                    <div class="event music">Music<br>10:00-11:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                                <td>
                                    <div class="event art">Art<br>10:00-11:00<br><small>Kate
                                            Alley</small></div>
                                </td>
                                <td>
                                    <div class="event yoga">Yoga<br>10:00-11:00<br><small>Marta
                                            Healy</small></div>
                                </td>
                                <td>
                                    <div class="event english">English<br>10:00-11:00<br><small>James
                                            Smith</small></div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>11:00am</td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                                <td>
                                    <div class="event break">Break<br>11:00-12:00</div>
                                </td>
                            </tr>
                            <tr>
                                <td>12:00pm</td>
                                <td></td>
                                <td>
                                    <div class="event art">Art<br>12:00-1:00<br><small>Kate
                                            Alley</small></div>
                                </td>
                                <td>
                                    <div class="event dance">Dance<br>12:00-1:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event music">Music<br>12:00-1:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event yoga">Yoga<br>12:00-1:00<br><small>Marta
                                            Healy</small></div>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>01:00pm</td>
                                <td>
                                    <div class="event english">English<br>1:00-2:00<br><small>James
                                            Smith</small></div>
                                </td>
                                <td>
                                    <div class="event music">Music<br>1:00-2:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td></td>
                                <td>
                                    <div class="event yoga">Yoga<br>1:00-2:00<br><small>Marta
                                            Healy</small></div>
                                </td>
                                <td>
                                    <div class="event music">Music<br>1:00-2:00<br><small>Ivana
                                            Wong</small></div>
                                </td>
                                <td>
                                    <div class="event english">English<br>1:00-2:00<br><small>James
                                            Smith</small></div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
