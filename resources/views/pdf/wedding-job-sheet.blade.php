<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            background-color: white;
            color: black;
            margin: 0;
            padding: 0;
        }
        .header {
            border-bottom: 1px solid black;
            margin-bottom: 20px;
            padding-bottom: 10px;
        }

        .table {
            width: 100%;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .table h3 {
            margin: 0 0 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
        }

        th {
            background: #ffffff;
        }

        .muted {
            color: #333;
            font-size: 10px;
        }
    </style>
    <title>Job Sheet</title>
</head>
<body>

<div class="header">
    <div style="position: relative">
        <div>
            <h2>{{ $wedding->partnerA_firstname }} {{ $wedding->partnerA_lastname }} & {{ $wedding->partnerB_firstname }} {{ $wedding->partnerB_lastname }}</h2>
            <p> {{ $wedding->venue->name }} | {{ \Carbon\Carbon::parse($wedding->date)->format('d/m/Y') }}</p>
        </div>
    </div>
    <img src="{{ public_path('images/logo-text-black.png') }}"
         style="position: absolute; top: 0; right: 0; height: 80px;" alt="Oldwalls Logo">

</div>

@foreach($tables as $t)
    <div class="table">
        <h3>{{ $t['name'] }}</h3>

        <table >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Meal</th>
                    <th>Notes</th>
                </tr>
            </thead>

            <tbody>
                @foreach($t['guests'] as $g)
                    <tr>
                        <td>{{ $g['name'] }}</td>
                        <td>{{ $g['menu_item']['name'] ?? 'Not Yet Set' }}</td>
                        <td class="muted">{{ $g['notes'] ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endforeach

</body>
</html>
